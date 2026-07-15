export interface ServiceTier {
  name: string;
  priceRange: string;
  deliverables: string[];
  timeline: string;
}

export const SERVICES: ServiceTier[] = [
  {
    name: "Feasibility & Planning",
    priceRange: "$4,000 – $8,000",
    deliverables: ["3D renders", "BOM", "Technical risk analysis"],
    timeline: "1–2 weeks",
  },
  {
    name: "Working Alpha",
    priceRange: "$12,000 – $25,000",
    deliverables: ["Fully functional prototype", "Complete files"],
    timeline: "4–8 weeks",
  },
  {
    name: "Small-Batch Beta",
    priceRange: "$30,000 – $60,000",
    deliverables: ["3–10 refined units", "Test data", "Investor package"],
    timeline: "8–14 weeks",
  },
];
