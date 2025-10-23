// Simple serverless function returning sample portfolio data without DB imports

const portfolioSamples = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Modern multi-vendor marketplace with AI-powered recommendations and automated inventory management.",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    projectUrl: "https://example.com/ecommerce",
    technologies: ["React", "Node.js", "PostgreSQL"],
    tags: ["React", "Node.js", "E-commerce"],
    client: "TechFlow Inc",
    featured: true,
    category: "web-dev",
    year: "2024",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Analytics Dashboard",
    description: "Real-time business intelligence platform with automated reporting and predictive analytics.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    projectUrl: "https://example.com/analytics",
    technologies: ["Python", "React", "PostgreSQL", "D3.js"],
    tags: ["Data Analytics", "Automation", "Dashboard"],
    client: "DataCorp",
    featured: true,
    category: "automation",
    year: "2024",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: "Customer Support AI",
    description: "Intelligent customer service chatbot with natural language processing and sentiment analysis.",
    imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
    projectUrl: "https://example.com/support-ai",
    technologies: ["Python", "TensorFlow", "React", "WebSocket"],
    tags: ["AI", "Chatbot", "NLP"],
    client: "RetailMax",
    featured: true,
    category: "ai",
    year: "2023",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = async (req, res) => {
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
};