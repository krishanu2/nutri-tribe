export interface Product {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  mainCategory: 'Makhana (Fox Nuts)' | 'Premium Cookies';
  color: string;
  price: number;
  weights: string[];
  description: string;
  features: string[];
  badge?: string;
  image: string;
  images: string[];
}

export const products: Product[] = [
  {
    id: 1,
    slug: "plain-makhana",
    name: "Plain Makhana",
    tagline: "Pure. Natural. Timeless.",
    category: "Raw / Premium 6-Suta",
    mainCategory: "Makhana (Fox Nuts)",
    color: "#009846",
    price: 199,
    weights: ["50g", "90g"],
    description: "Premium fox nuts sourced directly from the lily ponds of Mithila, Bihar. Hand-roasted in small batches to preserve maximum nutrition and crunch.",
    features: ["100% Natural", "No Preservatives", "High Protein", "Gluten Free", "Ayurvedic Superfood"],
    badge: "BESTSELLER",
    image: "https://picsum.photos/seed/plain-makhana/600/600",
    images: [
      "https://picsum.photos/seed/plain-makhana/600/600",
      "https://picsum.photos/seed/plain-makhana2/600/600",
      "https://picsum.photos/seed/plain-makhana3/600/600",
    ],
  },
  {
    id: 2,
    slug: "peri-peri-makhana",
    name: "Peri Peri Makhana",
    tagline: "Fiery. Bold. Unstoppable.",
    category: "Roasted Flavours",
    mainCategory: "Makhana (Fox Nuts)",
    color: "#7a4dff",
    price: 219,
    weights: ["50g", "90g"],
    description: "Your favourite makhana gets a fiery makeover with our signature peri peri spice blend. Roasted, not fried.",
    features: ["No MSG", "No Artificial Colours", "Roasted Not Fried", "Gluten Free"],
    badge: "HOT SELLER",
    image: "https://picsum.photos/seed/peri-peri/600/600",
    images: [
      "https://picsum.photos/seed/peri-peri/600/600",
      "https://picsum.photos/seed/peri-peri2/600/600",
    ],
  },
  {
    id: 3,
    slug: "cream-onion-makhana",
    name: "Cream & Onion",
    tagline: "Creamy. Crunchy. Addictive.",
    category: "Roasted Flavours",
    mainCategory: "Makhana (Fox Nuts)",
    color: "#7a4dff",
    price: 219,
    weights: ["50g", "90g"],
    description: "A classic flavor profile elevated with premium makhana. Smooth cream meets caramelized onion in every crunch.",
    features: ["No MSG", "Roasted Not Fried", "Gluten Free"],
    image: "https://picsum.photos/seed/cream-onion/600/600",
    images: [
      "https://picsum.photos/seed/cream-onion/600/600",
      "https://picsum.photos/seed/cream-onion2/600/600",
    ],
  },
  {
    id: 4,
    slug: "tangy-cheese-makhana",
    name: "Tangy Cheese",
    tagline: "Cheesy. Tangy. Irresistible.",
    category: "Roasted Flavours",
    mainCategory: "Makhana (Fox Nuts)",
    color: "#7a4dff",
    price: 219,
    weights: ["50g", "90g"],
    description: "Cheesy never felt this healthy. Real cheese flavour meets the clean crunch of mithila makhana.",
    features: ["Calcium Rich", "No Artificial Preservatives", "Vegetarian"],
    badge: "NEW",
    image: "https://picsum.photos/seed/tangy-cheese/600/600",
    images: [
      "https://picsum.photos/seed/tangy-cheese/600/600",
      "https://picsum.photos/seed/tangy-cheese2/600/600",
    ],
  },
  {
    id: 5,
    slug: "salt-pepper-makhana",
    name: "Salt & Pepper",
    tagline: "Classic. Clean. Crunchy.",
    category: "Raw / Premium 6-Suta",
    mainCategory: "Makhana (Fox Nuts)",
    color: "#009846",
    price: 199,
    weights: ["50g", "90g"],
    description: "The perfect balance of sea salt and cracked black pepper on premium fox nuts. Simple, clean, satisfying.",
    features: ["100% Natural", "Minimal Ingredients", "Gluten Free"],
    image: "https://picsum.photos/seed/salt-pepper/600/600",
    images: [
      "https://picsum.photos/seed/salt-pepper/600/600",
      "https://picsum.photos/seed/salt-pepper2/600/600",
    ],
  },
  {
    id: 6,
    slug: "premium-cookies",
    name: "Premium Cookies",
    tagline: "Guilt-Free Indulgence.",
    category: "Premium Cookies",
    mainCategory: "Premium Cookies",
    color: "#7d3627",
    price: 249,
    weights: ["100g"],
    description: "Artisan-crafted cookies made with wholesome ingredients. No maida, no refined sugar — just pure, premium taste.",
    features: ["No Maida", "No Refined Sugar", "Premium Ingredients"],
    badge: "PREMIUM",
    image: "https://picsum.photos/seed/premium-cookies/600/600",
    images: [
      "https://picsum.photos/seed/premium-cookies/600/600",
      "https://picsum.photos/seed/premium-cookies2/600/600",
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const categories = ["All", "Roasted Flavours", "Raw / Premium 6-Suta", "Premium Cookies"];
