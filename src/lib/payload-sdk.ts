import { PayloadSDK } from "@payloadcms/sdk";
import type { Config } from "@/payload-types";

/**
 * Type-safe client for the Payload REST API, for use in browser code.
 * (Server code should use `getPayload` directly instead of going over HTTP.)
 *
 * The fetch wrapper resolves `globalThis.fetch` at call time rather than
 * letting the SDK bind it at module load, so test stubs and polyfills that
 * replace the global after import are still picked up.
 */
export const payloadSdk = new PayloadSDK<Config>({
  baseURL: "/api",
  fetch: (url, init) => globalThis.fetch(url, init),
});
