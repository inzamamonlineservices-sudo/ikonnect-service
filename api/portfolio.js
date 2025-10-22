// Simple serverless function returning sample portfolio data without DB imports

const portfolioSamples = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Modern e-commerce solution with advanced features",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    projectUrl: "https://example.com/ecommerce",
    technologies: ["React", "Node.js", "PostgreSQL"],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Mobile Banking App",
    description: "Secure and user-friendly mobile banking application",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
    projectUrl: "https://example.com/banking",
    technologies: ["React Native", "Express", "MongoDB"],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: "Healthcare Dashboard",
    description: "Comprehensive healthcare management system",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
    projectUrl: "https://example.com/healthcare",
    technologies: ["Vue.js", "Python", "MySQL"],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { featured } = req.query || {};
    let items = portfolioSamples;
    if (featured === "true") items = items.filter((i) => i.featured);
    return res.status(200).json(items);
  } catch (err) {
    console.error("Portfolio API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}