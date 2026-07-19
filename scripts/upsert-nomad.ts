/**
 * One-off content load for the ADAMAAS Nomad product, from the client's
 * product description (July 2026). Idempotent: re-running updates the same
 * product (matched by slug) and skips media that was already uploaded.
 *
 * Run with: bunx payload run scripts/upsert-nomad.ts
 */
import { getPayload, type Payload } from "payload";
import config from "../src/payload.config";

const GITHUB_RAW =
  "https://raw.githubusercontent.com/nickadamaas/adamaas-nomad/main";

const DOWNLOADS = [
  {
    label: "3D Print Project (.3mf)",
    filename: "adamaas-nomad.3mf",
    mimetype: "application/octet-stream",
  },
  {
    label: "Full Assembly (.zip)",
    filename: "nomad-full-assembly.zip",
    mimetype: "application/zip",
  },
];

async function uploadFromGitHub(
  payload: Payload,
  { label, filename, mimetype }: (typeof DOWNLOADS)[number],
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

  const res = await fetch(`${GITHUB_RAW}/${filename}`);
  if (!res.ok) {
    throw new Error(`Failed to download ${filename}: HTTP ${res.status}`);
  }
  const data = Buffer.from(await res.arrayBuffer());
  const media = await payload.create({
    collection: "media",
    data: { alt: `ADAMAAS Nomad ${label}` },
    file: { data, name: filename, mimetype, size: data.byteLength },
  });
  payload.logger.info(`uploaded media "${filename}" (id ${media.id})`);
  return media.id;
}

const nomad = {
  name: "ADAMAAS Nomad",
  type: "product" as const,
  slug: "nomad",
  tagline: "30+ minute flights so quiet you'll hear the birds scream",
  // The shop card's "from" price — the cheapest purchasable tier.
  basePrice: 29,
  heroDescription:
    "18650-powered, low-profile PCTG frame, DJI 04 VTX. Print a new arm in 20 minutes if you lawn-dart. The ultimate prototyping platform — every mount, cage, and accessory is open-source.",
  description:
    "The ADAMAAS Nomad is a hand-crafted, open-source 5-inch FPV quad engineered for epic silent endurance, smooth analog cinematic footage, and unbreakable DIY resilience. Built around a lightweight custom 3D-printed low-profile PETG frame, efficient 2204 motors on 5x3 props, and a builder-crafted 3S Li-ion pack with high-discharge 30C 18650 cells, it's the go-to rig for pilots who demand maximum airtime, minimal noise, and endless customization—without exotic prices or fragile carbon.",
  techSpecs: [
    {
      label: "Frame Size / Type",
      value:
        "Custom 5-inch long-range explorer (ADAMAAS low-profile PCTG 3D-printed design)",
    },
    { label: "Dry Weight", value: "411g (without battery)" },
    { label: "Battery Weight", value: "145g (custom 3S Li-ion)" },
    { label: "All-Up Weight (AUW)", value: "~556g" },
    {
      label: "Flight Time",
      value:
        "20–30+ minutes (efficient silent cruise/exploration; 15–25 min mixed/aggressive) – custom 30C 18650 pack + high-efficiency props deliver marathon-level Li-ion endurance",
    },
    { label: "Video System", value: "DJI 04" },
    {
      label: "Flight Controller Stack",
      value: "Flywoo GOKU Pro Mini Stack - F7 FC + 45A 2-6S AM32 4-in-1 ESC",
    },
    {
      label: "Control Link",
      value:
        "BETAFPV ELRS 2.4GHz Nano Receiver – telemetry-strong, long-range reliability",
    },
    {
      label: "Recommended Battery",
      value: "Custom 3S Li-ion ~3000mAh class (30C 18650 cells, lightweight build)",
    },
    {
      label: "Top Speed",
      value:
        "80–100 km/h burst / 50–70 km/h efficient cruise (optimized for silent range)",
    },
    {
      label: "Build Style",
      value: "Ultra-efficient open-source explorer / DIY Li-ion silent marathon rig",
    },
  ],
  useCases: [
    {
      title: "Mapping & Surveying",
      description: "Stable, quiet platform for extended aerial data collection",
    },
    {
      title: "Wildlife Filming",
      description:
        "Near-silent operation keeps animals undisturbed—perfect for natural cinematic shots",
    },
    {
      title: "Experimental Missions",
      description:
        "Open-source mounts/cages make it easy to test sensors, lights, or custom gear",
    },
    {
      title: "Quiet Cruises",
      description:
        "Stealthy, long-endurance flights without drawing attention",
    },
  ],
  // The free "Open-Source Frame Files" tier is deliberately not a variant —
  // it is served by the Downloads tab, and a $0 cart would fail Stripe's
  // session minimum.
  variants: [
    {
      name: "Frame Pack",
      price: 29,
      description: "Printed PCTG ready-to-assemble + hardware — durable frame shipped",
    },
    {
      name: "Electronics Kit",
      price: 199,
      description:
        "Motors + AIO stack + RX — core performance bundle (VTX not included)",
    },
    {
      name: "Full Kit",
      price: 269,
      description:
        "PCTG frame, electronics + battery (VTX not included)",
      isDefault: true,
    },
    {
      name: "Ultimate Long-Range Bundle",
      price: 449,
      description:
        "Marathon-ready kit for non-stop adventures: BNF + 4× Li-ion packs + DJI 04",
    },
  ],
};

const payload = await getPayload({ config });

const downloadFiles = [];
for (const download of DOWNLOADS) {
  downloadFiles.push({
    label: download.label,
    file: await uploadFromGitHub(payload, download),
  });
}

const data = { ...nomad, downloadFiles };
const existing = await payload.find({
  collection: "products",
  where: { slug: { equals: nomad.slug } },
  limit: 1,
});

// Outside a Next request revalidatePath would throw — skip it; the dev
// server / next build will render fresh data anyway.
const context = { disableRevalidate: true };

if (existing.docs[0]) {
  await payload.update({
    collection: "products",
    id: existing.docs[0].id,
    data,
    context,
  });
  payload.logger.info(`updated product "${nomad.slug}" (id ${existing.docs[0].id})`);
} else {
  const created = await payload.create({ collection: "products", data, context });
  payload.logger.info(`created product "${nomad.slug}" (id ${created.id})`);
}

process.exit(0);
