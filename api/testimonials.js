// Simple serverless function returning sample testimonial data without DB imports

const testimonialSamples = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechStart Inc.",
    position: "CEO",
    content:
      "Ikonnect transformed our digital presence completely. Their innovative approach and attention to detail exceeded our expectations.",
    rating: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "Global Solutions",
    position: "CTO",
    content:
      "Outstanding work on our e-commerce platform. The team delivered beyond what we imagined possible.",
    rating: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "Creative Agency",
    position: "Creative Director",
    content:
      "Professional, creative, and results-driven. Ikonnect is our go-to partner for all digital projects.",
    rating: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    featured: true,
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
    let items = testimonialSamples;
    if (featured === "true") items = items.filter((i) => i.featured);
    return res.status(200).json(items);
  } catch (err) {
    console.error("Testimonials API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};