import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyTurnstileToken } from "./turnstile";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("verifyTurnstileToken", () => {
  it("returns true when Cloudflare confirms the token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      }),
    );

    await expect(verifyTurnstileToken("token")).resolves.toBe(true);
  });

  it("returns false when Cloudflare rejects the token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: false }),
      }),
    );

    await expect(verifyTurnstileToken("token")).resolves.toBe(false);
  });

  it("returns false on a non-2xx verification response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 503 }),
    );

    await expect(verifyTurnstileToken("token")).resolves.toBe(false);
  });

  it("sends the secret and token as form data to the siteverify endpoint", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-key");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await verifyTurnstileToken("the-token");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    );
    expect(init.body.get("secret")).toBe("secret-key");
    expect(init.body.get("response")).toBe("the-token");
  });
});
