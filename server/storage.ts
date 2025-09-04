import { 
  type User, 
  type InsertUser, 
  type Contact, 
  type InsertContact,
  type Newsletter,
  type InsertNewsletter,
  type PortfolioItem,
  type InsertPortfolioItem,
  type BlogPost,
  type InsertBlogPost,
  type Testimonial,
  type InsertTestimonial
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  // Newsletter
  subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  getNewsletterSubscribers(): Promise<Newsletter[]>;
  
  // Portfolio
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItem(id: string): Promise<PortfolioItem | undefined>;
  getFeaturedPortfolioItems(): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  
  // Blog
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private newsletters: Map<string, Newsletter>;
  private portfolioItems: Map<string, PortfolioItem>;
  private blogPosts: Map<string, BlogPost>;
  private testimonials: Map<string, Testimonial>;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.newsletters = new Map();
    this.portfolioItems = new Map();
    this.blogPosts = new Map();
    this.testimonials = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample portfolio items
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

    portfolioSamples.forEach(item => {
      const id = randomUUID();
      const portfolioItem: PortfolioItem = {
        ...item,
        id,
        createdAt: new Date()
      };
      this.portfolioItems.set(id, portfolioItem);
    });

    // Sample blog posts
    const blogSamples: InsertBlogPost[] = [
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

    blogSamples.forEach(post => {
      const id = randomUUID();
      const blogPost: BlogPost = {
        ...post,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.blogPosts.set(id, blogPost);
    });

    // Sample testimonials
    const testimonialSamples: InsertTestimonial[] = [
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

    testimonialSamples.forEach(testimonial => {
      const id = randomUUID();
      const testimonialItem: Testimonial = {
        ...testimonial,
        id,
        createdAt: new Date()
      };
      this.testimonials.set(id, testimonialItem);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  // Newsletter methods
  async subscribeNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    // Check if email already exists
    const existing = Array.from(this.newsletters.values()).find(
      n => n.email === insertNewsletter.email
    );
    
    if (existing) {
      if (!existing.active) {
        // Reactivate subscription
        existing.active = true;
        this.newsletters.set(existing.id, existing);
      }
      return existing;
    }

    const id = randomUUID();
    const newsletter: Newsletter = {
      ...insertNewsletter,
      id,
      subscribedAt: new Date(),
      active: true
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }

  async getNewsletterSubscribers(): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values()).filter(n => n.active);
  }

  // Portfolio methods
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getPortfolioItem(id: string): Promise<PortfolioItem | undefined> {
    return this.portfolioItems.get(id);
  }

  async getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values())
      .filter(item => item.featured)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPortfolioItem(insertItem: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = randomUUID();
    const item: PortfolioItem = {
      ...insertItem,
      id,
      createdAt: new Date()
    };
    this.portfolioItems.set(id, item);
    return item;
  }

  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.published)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.published && post.category === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.blogPosts.set(id, post);
    return post;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values())
      .filter(testimonial => testimonial.featured)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = randomUUID();
    const testimonial: Testimonial = {
      ...insertTestimonial,
      id,
      createdAt: new Date()
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
}

export const storage = new MemStorage();
