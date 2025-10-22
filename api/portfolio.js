import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { portfolioItems } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// Initialize database connection
const connectionString = process.env.DATABASE_URL;
let db;

if (connectionString) {
  const client = postgres(connectionString);
  db = drizzle(client);
}

// Sample data for fallback
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
    updatedAt: new Date()
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
    updatedAt: new Date()
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
    updatedAt: new Date()
  }
];

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { featured } = req.query;
      
      if (db && connectionString) {
        // Use database if available
        let query = db.select().from(portfolioItems);
        
        if (featured === 'true') {
          query = query.where(eq(portfolioItems.featured, true));
        }
        
        const items = await query;
        return res.status(200).json(items);
      } else {
        // Fallback to sample data
        let items = portfolioSamples;
        
        if (featured === 'true') {
          items = items.filter(item => item.featured);
        }
        
        return res.status(200).json(items);
      }
    }

    if (req.method === 'POST') {
      if (!db || !connectionString) {
        return res.status(503).json({ error: 'Database not configured' });
      }

      const newItem = req.body;
      const [created] = await db.insert(portfolioItems).values(newItem).returning();
      return res.status(201).json(created);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Portfolio API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}