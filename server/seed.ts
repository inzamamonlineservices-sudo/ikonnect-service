import { DatabaseStorage } from "./database-storage";
import { InsertPortfolioItem, InsertTestimonial } from "@shared/schema";

const portfolioSamples: InsertPortfolioItem[] = [
  {
    title: "E-commerce Platform",
    description: "Modern multi-vendor marketplace with AI-powered recommendations and automated inventory management.",
    category: "web-dev",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    tags: ["React", "Node.js", "AI", "E-commerce"],
    client: "TechFlow Inc",
    year: "2024",
    results: "150% increase in revenue within 6 months",
    process: "Discovery, Design, Development, Testing, Launch",
    technologies: ["React", "Node.js", "MongoDB", "AI/ML"],
    featured: true,
  },
  {
    title: "Analytics Dashboard",
    description: "Real-time business intelligence platform with automated reporting and predictive analytics.",
    category: "automation",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    tags: ["Data Analytics", "Automation", "Dashboard"],
    client: "DataCorp",
    year: "2024",
    results: "40+ hours saved weekly, 99% accuracy in reporting",
    process: "Requirements Analysis, Data Architecture, Development, Integration",
    technologies: ["Python", "React", "PostgreSQL", "D3.js"],
    featured: true,
  },
  {
    title: "Customer Support AI",
    description: "Intelligent customer service chatbot with natural language processing and sentiment analysis.",
    category: "ai",
    imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    tags: ["AI", "Chatbot", "NLP"],
    client: "RetailMax",
    year: "2023",
    results: "60% increase in customer satisfaction, 80% automation rate",
    process: "AI Training, Integration, Testing, Optimization",
    technologies: ["Python", "TensorFlow", "React", "WebSocket"],
    featured: true,
  },
];

const testimonialSamples: InsertTestimonial[] = [
  {
    name: "Michael Chen",
    position: "CTO",
    company: "TechFlow Inc.",
    content:
      "Ikonnect Service transformed our entire data workflow. Their automation solution saved us 40+ hours per week and eliminated manual errors completely.",
    rating: "5",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    featured: true,
  },
  {
    name: "Sarah Williams",
    position: "Director of Operations",
    company: "RetailMax",
    content:
      "The AI chatbot they developed increased our customer satisfaction by 60% and handles 80% of inquiries automatically. Outstanding work!",
    rating: "5",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    featured: true,
  },
  {
    name: "David Rodriguez",
    position: "Founder",
    company: "GrowthCorp",
    content:
      "Their web development team delivered a beautiful, fast, and scalable platform. Revenue increased by 150% in just 6 months. Highly recommended!",
    rating: "5",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    featured: true,
  },
];

export async function seedDatabaseIfEmpty() {
  const db = new DatabaseStorage();

  // Portfolio
  const portfolio = await db.getPortfolioItems();
  if (!portfolio || portfolio.length === 0) {
    for (const item of portfolioSamples) {
      await db.createPortfolioItem(item);
    }
    console.log("Seeded portfolio items");
  }

  // Testimonials
  const testimonials = await db.getTestimonials();
  if (!testimonials || testimonials.length === 0) {
    for (const t of testimonialSamples) {
      await db.createTestimonial(t);
    }
    console.log("Seeded testimonials");
  }
}