const SANITY_PROJECT_ID = "531mn2v8";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 1024 * 1024 * 1024;

interface IEnv {
  ASSETS: { fetch(input: RequestInfo, init?: RequestInit): Promise<Response> };
  SANITY_WRITE_TOKEN: string;
}

interface IContentBlock {
  _type: string;
  _key: string;
  asset?: { _type: "reference"; _ref: string };
  url?: string;
}

class SubmissionValidationError extends Error {}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanityUrl(endpoint: string): string {
  return `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/${endpoint}`;
}

function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isFilmCategoryTitle(title: string): boolean {
  return title.toLowerCase().includes("film");
}

function videoBlockType(value: string): "youtube" | "vimeo" | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const hostname = url.hostname.toLowerCase();
  if (hostname === "youtu.be") {
    return url.pathname.split("/").find(Boolean)?.length === 11 ? "youtube" : null;
  }
  if (hostname === "youtube.com" || hostname === "www.youtube.com") {
    const id = url.pathname === "/watch" ? (url.searchParams.get("v") ?? "") : (url.pathname.split("/")[2] ?? "");
    return id.length === 11 ? "youtube" : null;
  }
  if (hostname === "vimeo.com" || hostname === "www.vimeo.com") {
    return url.pathname.split("/").some((part) => /^\d+$/.test(part)) ? "vimeo" : null;
  }

  return null;
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

async function fetchCategoryTitle(categoryId: string, token: string): Promise<string | null> {
  if (!/^[a-zA-Z0-9_.-]+$/.test(categoryId)) {
    return null;
  }

  const query = `*[_type == "category" && _id == ${JSON.stringify(categoryId)}][0].title`;
  const queryEndpoint = sanityUrl(`data/query/${SANITY_DATASET}`);
  const queryUrl = `${queryEndpoint}?query=${encodeURIComponent(query)}`;
  const response = await fetch(queryUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Category lookup failed: ${text}`);
  }

  const data = (await response.json()) as { result?: unknown };
  return typeof data.result === "string" ? data.result : null;
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
    return "Visningsbilde er for stort (maks 10 MB).";
  }
  if (!image.type.startsWith("image/")) {
    return "Visningsbilde må være et bilde.";
  }
  return null;
}

function validateRequiredFields(categoryId: string, title: string, members: string, image: File | null): void {
  if (categoryId === "" || title === "") {
    throw new SubmissionValidationError("Kategori og tittel er påkrevd.");
  }
  if (title.length > 200) {
    throw new SubmissionValidationError("Tittelen er for lang (maks 200 tegn).");
  }
  if (members === "") {
    throw new SubmissionValidationError("Minst ett medlem (navn og klasse) er påkrevd.");
  }

  const imageError = validateImage(image);
  if (imageError !== null) {
    throw new SubmissionValidationError(imageError);
  }
}

function buildVideoContent(formData: FormData): IContentBlock[] {
  const videoUrl = formString(formData, "videoUrl");
  if (videoUrl === "") {
    throw new SubmissionValidationError("Du må legge inn en YouTube- eller Vimeo-lenke for filmprosjekter.");
  }
  if (formData.getAll("attachment[]").some((file) => file instanceof File && file.size > 0)) {
    throw new SubmissionValidationError("Filmprosjekter skal leveres med YouTube- eller Vimeo-lenke, ikke filopplasting.");
  }

  const type = videoBlockType(videoUrl);
  if (type === null) {
    throw new SubmissionValidationError("Lenken må være en gyldig YouTube- eller Vimeo-lenke.");
  }

  return [{ _type: type, _key: "0", url: videoUrl }];
}

async function buildFileContent(formData: FormData, token: string): Promise<IContentBlock[]> {
  if (formString(formData, "videoUrl") !== "") {
    throw new SubmissionValidationError("Denne kategorien skal leveres med filopplasting, ikke videolenke.");
  }

  const blocks: IContentBlock[] = [];
  let totalSize = 0;

  for (const file of formData.getAll("attachment[]")) {
    if (file instanceof File && file.size > 0) {
      totalSize += file.size;
      if (totalSize > MAX_TOTAL_FILE_SIZE) {
        throw new SubmissionValidationError("Total filstørrelse overskrider grensen på 1 GB.");
      }
      const assetId = await uploadAsset("files", file, token);
      blocks.push({
        _type: "file",
        _key: String(blocks.length),
        asset: { _type: "reference", _ref: assetId },
      });
    }
  }

  if (blocks.length === 0) {
    throw new SubmissionValidationError("Du må laste opp minst én fil.");
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
    description: `Laget av ${members}`,
    content,
  };

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

  try {
    const categoryId = formString(formData, "category");
    const title = formString(formData, "title");
    const members = formString(formData, "members");
    const imageValue = formData.get("image");
    const image = imageValue instanceof File ? imageValue : null;

    validateRequiredFields(categoryId, title, members, image);

    const categoryTitle = await fetchCategoryTitle(categoryId, env.SANITY_WRITE_TOKEN);
    if (categoryTitle === null) {
      return jsonResponse({ error: "Ugyldig kategori." }, 400);
    }

    const content = isFilmCategoryTitle(categoryTitle)
      ? buildVideoContent(formData)
      : await buildFileContent(formData, env.SANITY_WRITE_TOKEN);
    const imageAssetId = await processImage(image, env.SANITY_WRITE_TOKEN);
    const document = buildDocument(title, categoryId, members, content, imageAssetId);
    const slug = slugify(title);

    const response = await fetch(sanityUrl(`data/mutate/${SANITY_DATASET}`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SANITY_WRITE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mutations: [{ createOrReplace: { ...document, _id: `drafts.${slug}` } }] }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Sanity mutation failed: ${text}`);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    if (error instanceof SubmissionValidationError) {
      return jsonResponse({ error: error.message }, 400);
    }

    const message = error instanceof Error ? error.message : "Ukjent feil";
    console.error("Submission error:", message);
    return jsonResponse({ error: "Noe gikk galt. Prøv igjen senere." }, 500);
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
