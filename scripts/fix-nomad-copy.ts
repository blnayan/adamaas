/**
 * Content fix for the Nomad product page (Oct 2026). The affected copy lives
 * in the Payload CMS (Postgres), not in the repo, so a code deploy alone does
 * not change it — this script patches the live product document in place.
 *
 *  1. Drops the "Stand STEP" link from the description. The stand was merged
 *     into adamaas-nomad.step in nickadamaas/adamaas-nomad v1.0.1 and
 *     adamaas-nomad-stand.step now 404s. The full airframe STEP link (already
 *     on the line above it) covers the stand.
 *  2. "ADAMAAS" -> "Adamaas" in visible product copy (description, tech specs).
 *  3. Names the Auline V45 as the 3S Li-ion pack in the description.
 *
 * Targeted string replacements only (no full overwrite), so unrelated CMS
 * edits are preserved. Idempotent. Dry run by default; prints a diff.
 *
 * Dry run:  bunx payload run scripts/fix-nomad-copy.ts
 * Apply:    APPLY=1 bunx payload run scripts/fix-nomad-copy.ts
 *
 * Run from a `payload run` script, the page refreshes via hourly ISR
 * (revalidatePath is skipped outside a Next request). Saving the product
 * once in the Payload admin purges it immediately.
 */
import { getPayload } from "payload";
import config from "../src/payload.config";

const SLUG = "nomad";
const apply = process.env.APPLY === "1";

const DESCRIPTION_REPLACEMENTS: [string | RegExp, string][] = [
  [/\n- Stand STEP: https:\/\/github\.com\/nickadamaas\/adamaas-nomad\/raw\/main\/adamaas-nomad-stand\.step/g, ""],
  ["(3mf + two STEPs)", "(3mf + STEP)"],
  ["Full airframe STEP:", "Full airframe STEP (airframe + stand):"],
  ["and a 3S Li-ion pack.", "and an Auline V45 3S Li-ion pack."],
  [/\bADAMAAS\b(?! LLC)/g, "Adamaas"],
];

function applyAll(text: string, replacements: [string | RegExp, string][]) {
  return replacements.reduce(
    (acc, [from, to]) =>
      typeof from === "string" ? acc.split(from).join(to) : acc.replace(from, to),
    text,
  );
}

const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: "products",
  where: { slug: { equals: SLUG } },
  limit: 1,
  depth: 0,
});
const product = docs[0];
if (!product) throw new Error(`product "${SLUG}" not found`);

const description = applyAll(product.description, DESCRIPTION_REPLACEMENTS);
const techSpecs = (product.techSpecs ?? []).map((spec) => ({
  ...spec,
  value: spec.value.replace(/\bADAMAAS\b(?! LLC)/g, "Adamaas"),
}));

const changes: string[] = [];
if (description !== product.description) {
  changes.push(`description:\n--- before\n${product.description}\n+++ after\n${description}`);
}
(product.techSpecs ?? []).forEach((spec, i) => {
  if (spec.value !== techSpecs[i].value) {
    changes.push(`techSpecs[${spec.label}]: "${spec.value}" -> "${techSpecs[i].value}"`);
  }
});

if (changes.length === 0) {
  payload.logger.info("nothing to change — already fixed");
  process.exit(0);
}
console.log(changes.join("\n\n"));

if (!apply) {
  payload.logger.info("dry run — re-run with APPLY=1 to write");
  process.exit(0);
}

await payload.update({
  collection: "products",
  id: product.id,
  data: { description, techSpecs },
});
payload.logger.info(`updated product "${SLUG}" (id ${product.id})`);
process.exit(0);
