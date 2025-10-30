import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { DatabaseStorage } from "./database-storage";

const storage = new DatabaseStorage();
import { insertContactSchema, insertNewsletterSchema } from "@shared/schema";
import { z } from "zod";

import { registerApiRoutes } from "./api-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register new API routes
  registerApiRoutes(app);
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit contact form" 
        });
      }
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter", async (req, res) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeNewsletter(newsletterData);
      res.json({ success: true, subscription });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid email format", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to subscribe to newsletter" 
        });
      }
    }
  });

  // Get portfolio items
  app.get("/api/portfolio", async (req, res) => {
    try {
      const { featured } = req.query;
      const items = featured === 'true' 
        ? await storage.getFeaturedPortfolioItems()
        : await storage.getPortfolioItems();
      console.log('Fetched portfolio items:', items);
      res.json(items);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch portfolio items" 
      });
    }
  });

  // Get portfolio item by ID
  app.get("/api/portfolio/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await storage.getPortfolioItem(id);
      console.log(`Fetched portfolio item ${id}:`, item);
      if (!item) {
        res.status(404).json({ 
          success: false, 
          message: "Portfolio item not found" 
        });
        return;
      }
      res.json(item);
    } catch (error) {
      console.error(`Error fetching portfolio item ${req.params.id}:`, error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch portfolio item" 
      });
    }
  });

  // Get blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      const { category } = req.query;
      const posts = category 
        ? await storage.getBlogPostsByCategory(category as string)
        : await storage.getPublishedBlogPosts();
      console.log('Fetched blog posts:', posts);
      res.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch blog posts" 
      });
    }
  });

  // Get blog post by slug
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPost(slug);
      console.log(`Fetched blog post ${slug}:`, post);
      if (!post) {
        res.status(404).json({ 
          success: false, 
          message: "Blog post not found" 
        });
        return;
      }
      res.json(post);
    } catch (error) {
      console.error(`Error fetching blog post ${req.params.slug}:`, error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch blog post" 
      });
    }
  });

  // Get testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const { featured } = req.query;
      const testimonials = featured === 'true'
        ? await storage.getFeaturedTestimonials()
        : await storage.getTestimonials();
      console.log('Fetched testimonials:', testimonials);
      res.json(testimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch testimonials" 
      });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket server for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        switch (data.type) {
          case 'subscribe':
            // Subscribe to specific channels (e.g., project updates, chat)
            (ws as any).channels = data.channels || [];
            ws.send(JSON.stringify({ type: 'subscribed', channels: data.channels }));
            break;
            
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
            
          default:
            console.log('Unknown WebSocket message type:', data.type);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
    
    // Send welcome message
    ws.send(JSON.stringify({ 
      type: 'welcome', 
      message: 'Connected to Ikonnect Service real-time updates' 
    }));
  });
  
  // Broadcast function for real-time updates
  (httpServer as any).broadcast = (channel: string, data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const clientChannels = (client as any).channels || [];
        if (clientChannels.includes(channel)) {
          client.send(JSON.stringify({ type: 'broadcast', channel, data }));
        }
      }
    });
  };
  
  return httpServer;
}

router.get("/api/portfolio", async (req, res) => {
  const items = await storage.getPortfolio();
  console.log('Fetched portfolio items:', items);
  res.json(items);
});

router.get("/api/portfolio/:id", async (req, res) => {
  const item = await storage.getPortfolioItem(req.params.id);
  console.log(`Fetched portfolio item ${req.params.id}:`, item);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ 
      success: false, 
      message: "Portfolio item not found" 
    });
    return;
  }
});

router.get("/api/blog", async (req, res) => {
  const posts = await storage.getBlogPosts();
  console.log('Fetched blog posts:', posts);
  res.json(posts);
});

router.get("/api/blog/:slug", async (req, res) => {
  const post = await storage.getBlogPost(req.params.slug);
  console.log(`Fetched blog post ${req.params.slug}:`, post);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ 
      success: false, 
      message: "Blog post not found" 
    });
    return;
  }
});

router.get("/api/testimonials", async (req, res) => {
  const testimonials = await storage.getTestimonials();
  console.log('Fetched testimonials:', testimonials);
  res.json(testimonials);
});

return router;
