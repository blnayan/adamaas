export interface Variant {
    name: string;
    price: number;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    basePrice: number;
    description: string;
    badges: string[];
    variants?: Variant[];
    image: string; // Placeholder or path
}

export interface ServiceTier {
    name: string;
    priceRange: string;
    deliverables: string[];
    timeline: string;
}

export const PRODUCTS: Product[] = [
    {
        id: "reaper",
        name: "Reaper",
        slug: "reaper",
        tagline: "The Ultimate FPV Racer",
        basePrice: 89,
        description: "Built for speed and durability. The Reaper is a competition-grade frame designed to win.",
        badges: ["Open Source", "Sub-250g"],
        variants: [
            { name: "Frame Only", price: 89 },
            { name: "Electronics Only", price: 299 },
            { name: "BNF", price: 389 },
            { name: "RTF", price: 549 }
        ],
        image: "/images/reaper.jpg"
    },
    {
        id: "nomad",
        name: "Nomad",
        slug: "nomad",
        tagline: "Long Range Explorer",
        basePrice: 99,
        description: "Go where no drone has gone before. 30min+ flight time with a robust frame.",
        badges: ["30min+ Flight", "Open Source"],
        variants: [
            { name: "Frame Only", price: 99 },
            { name: "BNF", price: 429 },
            { name: "RTF", price: 599 }
        ],
        image: "/images/nomad.jpg"
    },
    {
        id: "nexus",
        name: "Nexus",
        slug: "nexus",
        tagline: "Cinematic Powerhouse",
        basePrice: 120,
        description: "Stable, smooth, and powerful. Designed for carrying cinema cameras.",
        badges: ["Founding Member Edition", "Open Source"],
        variants: [
            { name: "Frame Only", price: 120 },
            { name: "Electronics Only", price: 349 },
            { name: "BNF", price: 469 },
            { name: "RTF", price: 699 }
        ],
        image: "/images/nexus.jpg"
    },
    {
        id: "bundle",
        name: "Full Ecosystem Bundle",
        slug: "bundle",
        tagline: "Everything You Need",
        basePrice: 1200,
        description: "Get all three drones plus exclusive extras.",
        badges: ["Best Value"],
        image: "/images/bundle.jpg"
    }
];

export const SERVICES: ServiceTier[] = [
    {
        name: "Feasibility & Planning",
        priceRange: "$4,000 – $8,000",
        deliverables: ["3D renders", "BOM", "Technical risk analysis"],
        timeline: "1–2 weeks"
    },
    {
        name: "Working Alpha",
        priceRange: "$12,000 – $25,000",
        deliverables: ["Fully functional prototype", "Complete files"],
        timeline: "4–8 weeks"
    },
    {
        name: "Small-Batch Beta",
        priceRange: "$30,000 – $60,000",
        deliverables: ["3–10 refined units", "Test data", "Investor package"],
        timeline: "8–14 weeks"
    }
];
