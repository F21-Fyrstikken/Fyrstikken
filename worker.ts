interface IEnv {
  ASSETS: { fetch(input: RequestInfo, init?: RequestInit): Promise<Response> };
}

export default {
  async fetch(request: Request, env: IEnv): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/studio" || url.pathname.startsWith("/studio/")) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }

      const method = request.method.toUpperCase();
      const accept = request.headers.get("Accept") || "";
      const isNavigationRequest =
        (method === "GET" || method === "HEAD") && accept.includes("text/html");

      if (!isNavigationRequest) {
        return assetResponse;
      }
      return env.ASSETS.fetch(new Request(new URL("/studio/index.html", request.url), request));
    }

    return env.ASSETS.fetch(request);
  },
};
