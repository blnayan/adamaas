/**
 * One-off content load for the ADAMAAS Nomad 3D model (GLB converted from
 * the client's Fusion USDZ export, July 2026). Idempotent: media matched by
 * filename is reused.
 *
 * Run with: bunx payload run scripts/upload-nomad-model.ts
 */
import { readFile } from "node:fs/promises";
import { getPayload, type Payload } from "payload";
import config from "../src/payload.config";

const SOURCE_DIR = "/mnt/c/Users/User/Downloads";

const MODELS = [
  {
    source: "Nomad.glb",
    filename: "nomad-model.glb",
    mimetype: "model/gltf-binary",
    alt: "ADAMAAS Nomad interactive 3D model",
  },
  {
    source: "Nomad.usdz",
    filename: "nomad-model.usdz",
    mimetype: "model/vnd.usdz+zip",
    alt: "ADAMAAS Nomad AR model for iOS Quick Look",
  },
];

async function uploadModel(
  payload: Payload,
  { source, filename, mimetype, alt }: (typeof MODELS)[number],
): Promise<number> {
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
  });
  if (existing.docs[0]) {
    payload.logger.info(`media "${filename}" already uploaded, reusing`);
    return existing.docs[0].id;
  }

  const data = await readFile(`${SOURCE_DIR}/${source}`);
  const media = await payload.create({
    collection: "media",
    data: { alt },
    // Explicit mimetype: file-type sniffs .usdz as a plain zip, and iOS AR
    // Quick Look wants model/vnd.usdz+zip.
    file: { data, name: filename, mimetype, size: data.byteLength },
  });
  payload.logger.info(`uploaded media "${filename}" (id ${media.id})`);
  return media.id;
}

const payload = await getPayload({ config });

const nomad = (
  await payload.find({
    collection: "products",
    where: { slug: { equals: "nomad" } },
    limit: 1,
  })
).docs[0];
if (!nomad) throw new Error('product "nomad" not found — run upsert-nomad.ts first');

const [glb, usdz] = [
  await uploadModel(payload, MODELS[0]),
  await uploadModel(payload, MODELS[1]),
];

await payload.update({
  collection: "products",
  id: nomad.id,
  data: { model3d: glb, modelUsdz: usdz },
});
payload.logger.info('set model3d + modelUsdz on "nomad"');

process.exit(0);
