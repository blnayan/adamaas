/**
 * One-off content load for the ADAMAAS Nomad gallery images, from the
 * client's photos (July 2026). Idempotent: media that was already uploaded
 * (matched by filename) is reused, and the default variant's gallery is
 * reset to exactly these images in this order.
 *
 * Run with: bunx payload run scripts/upload-nomad-gallery.ts
 */
import { readFile } from "node:fs/promises";
import { getPayload, type Payload } from "payload";
import sharp from "sharp";
import config from "../src/payload.config";

const SOURCE_DIR = "/mnt/c/Users/User/Downloads";

const GALLERY = [
  {
    source: "6-nomad-flat-landscape-v2.png",
    filename: "nomad-1.jpg",
    alt: "ADAMAAS Nomad front view with vented top plate and FPV camera",
  },
  {
    source: "5-nomad-topstandopen-landscape-v2.png",
    filename: "nomad-2.jpg",
    alt: "ADAMAAS Nomad with top cover open showing cooling fan, flight stack, and Li-ion battery",
  },
  {
    source: "8-nomad-background.jpg",
    filename: "nomad-3.jpg",
    alt: "ADAMAAS Nomad angled on its display stand showing the bottom plate",
  },
  {
    source: "15AD5CD9-9339-465D-B80C-99183A713D1E.jpg",
    filename: "nomad-4.jpg",
    alt: "ADAMAAS Nomad hovering low over grass",
  },
];

async function uploadImage(
  payload: Payload,
  { source, filename, alt }: (typeof GALLERY)[number],
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

  // .rotate() bakes in EXIF orientation (one photo is straight off a
  // Sony camera) so the JPEG displays upright everywhere.
  const data = await sharp(await readFile(`${SOURCE_DIR}/${source}`))
    .rotate()
    .jpeg({ quality: 90 })
    .toBuffer();
  const media = await payload.create({
    collection: "media",
    data: { alt },
    file: { data, name: filename, mimetype: "image/jpeg", size: data.byteLength },
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

const images: { image: number }[] = [];
for (const entry of GALLERY) {
  images.push({ image: await uploadImage(payload, entry) });
}

// Galleries live on variants now — attach the photos to the default
// variant (the one preselected on the product page).
const targetName =
  nomad.variants?.find((v) => v.isDefault)?.name ?? nomad.variants?.[0]?.name;
if (!targetName) throw new Error('product "nomad" has no variants');
const variants = nomad.variants!.map((variant) =>
  variant.name === targetName ? { ...variant, images } : variant,
);

// Outside a Next request revalidatePath would throw — skip it; the dev
// server / next build will render fresh data anyway.
await payload.update({
  collection: "products",
  id: nomad.id,
  // The first gallery photo doubles as the hero image shown on shop
  // cards, the featured carousel, and image-less variants.
  data: { variants, heroImage: images[0].image },
  context: { disableRevalidate: true },
});
payload.logger.info(
  `set ${images.length} images on variant "${targetName}" + hero image on "nomad"`,
);

process.exit(0);
