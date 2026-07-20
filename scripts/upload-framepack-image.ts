/**
 * One-off content load for the ADAMAAS Nomad "Frame Pack" variant photo,
 * from the client's photos (July 2026). Idempotent: media that was already
 * uploaded (matched by filename) is reused, and the Frame Pack variant's
 * gallery is reset to exactly this image.
 *
 * Run with: bunx payload run scripts/upload-framepack-image.ts
 */
import { readFile } from "node:fs/promises";
import { getPayload } from "payload";
import sharp from "sharp";
import config from "../src/payload.config";

const SOURCE_DIR = "/mnt/c/Users/User/Downloads";

const IMAGE = {
  source: "A7649E50-29F6-4F0E-BCFC-DEA193E1EFD0.jpg",
  filename: "nomad-framepack-1.jpg",
  alt: "ADAMAAS Nomad Frame Pack — 3D-printed PCTG frame parts laid out: arms, top plate, bottom plate, and side rails",
};

const payload = await getPayload({ config });

const existing = await payload.find({
  collection: "media",
  where: { filename: { equals: IMAGE.filename } },
  limit: 1,
});
let imageId: number;
if (existing.docs[0]) {
  payload.logger.info(`media "${IMAGE.filename}" already uploaded, reusing`);
  imageId = existing.docs[0].id;
} else {
  // .rotate() bakes in EXIF orientation (photo is straight off an iPhone)
  // so the JPEG displays upright everywhere.
  const data = await sharp(await readFile(`${SOURCE_DIR}/${IMAGE.source}`))
    .rotate()
    .jpeg({ quality: 90 })
    .toBuffer();
  const media = await payload.create({
    collection: "media",
    data: { alt: IMAGE.alt },
    file: { data, name: IMAGE.filename, mimetype: "image/jpeg", size: data.byteLength },
  });
  payload.logger.info(`uploaded media "${IMAGE.filename}" (id ${media.id})`);
  imageId = media.id;
}

const nomad = (
  await payload.find({
    collection: "products",
    where: { slug: { equals: "nomad" } },
    limit: 1,
  })
).docs[0];
if (!nomad) throw new Error('product "nomad" not found — run upsert-nomad.ts first');

const variants = nomad.variants?.map((variant) =>
  variant.name === "Frame Pack"
    ? { ...variant, images: [{ image: imageId }] }
    : variant,
);
if (!variants?.some((v) => v.name === "Frame Pack")) {
  throw new Error('product "nomad" has no "Frame Pack" variant');
}

await payload.update({
  collection: "products",
  id: nomad.id,
  data: { variants },
});
payload.logger.info('set 1 image on variant "Frame Pack" of "nomad"');

process.exit(0);
