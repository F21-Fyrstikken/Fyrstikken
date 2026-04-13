const SANITY_PROJECT_ID = "531mn2v8";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_FILE_SIZE = 50 * 1024 * 1024;

interface IEnv {
  ASSETS: { fetch(input: RequestInfo, init?: RequestInit): Promise<Response> };
  SANITY_WRITE_TOKEN: string;
}

interface IContentBlock {
  _type: string;
  _key: string;
  url?: string;
  asset?: { _type: "reference"; _ref: string };
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanityUrl(endpoint: string): string {
  return `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/${endpoint}`;
}

async function uploadAsset(type: "images" | "files", file: File, token: string): Promise<string> {
  const response = await fetch(sanityUrl(`assets/${type}/${SANITY_DATASET}`), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Asset upload failed: ${text}`);
  }

  const result = (await response.json()) as { document: { _id: string } };
  return result.document._id;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[æ]/g, "ae")
    .replace(/[ø]/g, "o")
    .replace(/[å]/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 96);
}

function validateImage(image: File | null): string | null {
  if (image === null || image.size === 0) {
    return null;
  }
  if (image.size > MAX_IMAGE_SIZE) {
    return "Thumbnail er for stort (maks 10 MB).";
  }
  if (!image.type.startsWith("image/")) {
    return "Thumbnail må være et bilde.";
  }
  return null;
}

function validateAttachmentFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `Filen "${file.name}" er for stor (maks 50 MB).`;
  }
  return null;
}

async function buildContentFromAttachments(formData: FormData, token: string): Promise<IContentBlock[]> {
  const files = formData.getAll("attachment[]");
  const urls = formData.getAll("attachmentUrl[]") as string[];
  const blocks: IContentBlock[] = [];
  let key = 0;

  for (const file of files) {
    if (file instanceof File && file.size > 0) {
      const error = validateAttachmentFile(file);
      if (error !== null) {
        throw new Error(error);
      }
      const assetId = await uploadAsset("files", file, token);
      blocks.push({
        _type: "file",
        _key: String(key++),
        asset: { _type: "reference", _ref: assetId },
      });
    }
  }

  for (const url of urls) {
    const trimmed = url.trim();
    if (trimmed !== "") {
      blocks.push({ _type: "embed", _key: String(key++), url: trimmed });
    }
  }

  return blocks;
}

async function processImage(image: File | null, token: string): Promise<string | undefined> {
  if (image === null || image.size === 0) {
    return undefined;
  }
  return uploadAsset("images", image, token);
}

function buildDocument(
  title: string,
  categoryId: string,
  members: string,
  content: IContentBlock[],
  imageAssetId: string | undefined
): Record<string, unknown> {
  const doc: Record<string, unknown> = {
    _type: "project",
    title,
    slug: { _type: "slug", current: slugify(title) },
    category: { _type: "reference", _ref: categoryId },
  };

  if (members !== "") {
    doc.description = members;
  }

  if (content.length > 0) {
    doc.content = content;
  }

  if (imageAssetId !== undefined) {
    doc.image = {
      _type: "image",
      asset: { _type: "reference", _ref: imageAssetId },
    };
  }

  return doc;
}

async function handleSubmission(request: Request, env: IEnv): Promise<Response> {
  if (env.SANITY_WRITE_TOKEN === "") {
    return jsonResponse({ error: "Server er ikke konfigurert for innsendinger." }, 500);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: "Ugyldig skjemadata." }, 400);
  }

  const categoryId = (formData.get("category") as string | null) ?? "";
  const title = (formData.get("title") as string | null) ?? "";
  const image = formData.get("image") as File | null;

  if (categoryId === "" || title === "") {
    return jsonResponse({ error: "Kategori og tittel er påkrevd." }, 400);
  }

  if (title.length > 200) {
    return jsonResponse({ error: "Tittelen er for lang (maks 200 tegn)." }, 400);
  }

  const members = (formData.get("members") as string | null)?.trim() ?? "";
  if (members === "") {
    return jsonResponse({ error: "Minst ett medlem (navn og klasse) er påkrevd." }, 400);
  }

  const imageError = validateImage(image);
  if (imageError !== null) {
    return jsonResponse({ error: imageError }, 400);
  }

  try {
    const imageAssetId = await processImage(image, env.SANITY_WRITE_TOKEN);
    const content = await buildContentFromAttachments(formData, env.SANITY_WRITE_TOKEN);
    const document = buildDocument(title, categoryId, members, content, imageAssetId);
    const slug = slugify(title);

    const mutations = [{ createOrReplace: { ...document, _id: `drafts.${slug}` } }];

    const response = await fetch(sanityUrl(`data/mutate/${SANITY_DATASET}`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SANITY_WRITE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mutations }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Sanity mutation failed: ${text}`);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ukjent feil";
    console.error("Submission error:", message);
    return jsonResponse({ error: message }, 500);
  }
}

export default {
  async fetch(request: Request, env: IEnv): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/submit" && request.method === "POST") {
      return handleSubmission(request, env);
    }

    if (url.pathname.startsWith("/api/")) {
      return jsonResponse({ error: "Not found" }, 404);
    }

    if (url.pathname === "/studio" || url.pathname.startsWith("/studio/")) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }

      const method = request.method.toUpperCase();
      const accept = request.headers.get("Accept") ?? "";
      const isNavigationRequest = (method === "GET" || method === "HEAD") && accept.includes("text/html");

      if (!isNavigationRequest) {
        return assetResponse;
      }
      return env.ASSETS.fetch(new Request(new URL("/studio/index.html", request.url), request));
    }

    return env.ASSETS.fetch(request);
  },
};
