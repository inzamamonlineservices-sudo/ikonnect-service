import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { testimonials } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// Initialize database connection
const connectionString = process.env.DATABASE_URL;
let db;

if (connectionString) {
  const client = postgres(connectionString);
  db = drizzle(client);
}

// Sample data for fallback
const testimonialSamples = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechStart Inc.",
    role: "CEO",
    content: "Ikonnect transformed our digital presence completely. Their innovative approach and attention to detail exceeded our expectations.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "Global Solutions",
    role: "CTO",
    content: "Outstanding work on our e-commerce platform. The team delivered beyond what we imagined possible.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "Creative Agency",
    role: "Creative Director",
    content: "Professional, creative, and results-driven. Ikonnect is our go-to partner for all digital projects.",
    rating: 5,
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
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
        let query = db.select().from(testimonials);
        
        if (featured === 'true') {
          query = query.where(eq(testimonials.featured, true));
        }
        
        const items = await query;
        return res.status(200).json(items);
      } else {
        // Fallback to sample data
        let items = testimonialSamples;
        
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
      const [created] = await db.insert(testimonials).values(newItem).returning();
      return res.status(201).json(created);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Testimonials API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}