import { db } from '../server/db';
import { portfolioItems, blogPosts, testimonials } from '@shared/schema';
import { randomUUID } from 'crypto';

async function seed() {
  console.log('Seeding database...');

  // Sample portfolio items
  const portfolioSamples = [
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
      featured: true
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
      featured: true
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
      featured: true
    }
  ];

  await db.insert(portfolioItems).values(portfolioSamples.map(item => ({
    ...item,
    id: randomUUID(),
    createdAt: new Date(),
  })));

  // Sample blog posts
  const blogSamples = [
    {
      title: "The Future of AI in Business Automation",
      slug: "future-ai-business-automation",
      excerpt: "Explore how artificial intelligence is revolutionizing business processes and what it means for the future of work.",
      content: "Artificial intelligence is no longer a futuristic concept...",
      category: "AI",
      author: "Ikonnect Team",
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tags: ["AI", "Automation", "Business"],
      published: true,
      readTime: "5 min read"
    },
    {
      title: "Modern Web Development Trends in 2024",
      slug: "web-development-trends-2024",
      excerpt: "Discover the latest trends and technologies shaping web development in 2024.",
      content: "The web development landscape continues to evolve rapidly...",
      category: "Web Dev",
      author: "Ikonnect Team",
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tags: ["Web Development", "React", "Trends"],
      published: true,
      readTime: "7 min read"
    }
  ];

  await db.insert(blogPosts).values(blogSamples.map(post => ({
    ...post,
    id: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  })));

  // Sample testimonials
  const testimonialSamples = [
    {
      name: "Michael Chen",
      position: "CTO",
      company: "TechFlow Inc.",
      content: "Ikonnect Service transformed our entire data workflow. Their automation solution saved us 40+ hours per week and eliminated manual errors completely.",
      rating: "5",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      featured: true
    },
    {
      name: "Sarah Williams",
      position: "Director of Operations",
      company: "RetailMax",
      content: "The AI chatbot they developed increased our customer satisfaction by 60% and handles 80% of inquiries automatically. Outstanding work!",
      rating: "5",
      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      featured: true
    },
    {
      name: "David Rodriguez",
      position: "Founder",
      company: "GrowthCorp",
      content: "Their web development team delivered a beautiful, fast, and scalable platform. Revenue increased by 150% in just 6 months. Highly recommended!",
      rating: "5",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      featured: true
    }
  ];

  await db.insert(testimonials).values(testimonialSamples.map(testimonial => ({
    ...testimonial,
    id: randomUUID(),
    createdAt: new Date(),
  })));

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Failed to seed database:', err);
  process.exit(1);
});