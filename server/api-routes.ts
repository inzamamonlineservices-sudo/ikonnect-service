import type { Express } from "express";
import { DatabaseStorage } from "./database-storage";
import { generateChatResponse } from "./openai";
import { getSession, requireAdminAuth, requireClientAuth } from "./auth";
import { 
  insertCmsContentSchema, 
  insertClientProjectSchema,
  insertClientSchema,
  insertAnalyticsEventSchema,
  insertChatConversationSchema 
} from "@shared/schema";
import { z } from "zod";

export function registerApiRoutes(app: Express) {
  // Setup session middleware
  app.use(getSession());
  
  // Use database storage
  const dbStorage = new DatabaseStorage();

  // AI Chatbot routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId, context } = req.body;
      
      if (!message || !sessionId) {
        return res.status(400).json({ message: "Message and session ID are required" });
      }

      // Get conversation history for context
      const conversationHistory = await dbStorage.getChatConversations(sessionId);
      const messages = conversationHistory.map(c => ([
        { role: 'user' as const, content: c.userQuery },
        { role: 'assistant' as const, content: c.botResponse }
      ])).flat();
      
      // Add current message
      messages.push({ role: 'user', content: message });
      
      // Generate AI response
      const aiResponse = await generateChatResponse(messages, context);
      
      // Save conversation to database
      const conversation = await dbStorage.createChatConversation({
        sessionId,
        userQuery: message,
        botResponse: aiResponse,
        context: context || {}
      });
      
      res.json({ 
        response: aiResponse, 
        conversationId: conversation.id 
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.post("/api/chat/feedback", async (req, res) => {
    try {
      const { conversationId, satisfaction } = req.body;
      
      if (!conversationId || !satisfaction) {
        return res.status(400).json({ message: "Conversation ID and satisfaction rating are required" });
      }
      
      const updatedConversation = await dbStorage.updateChatSatisfaction(conversationId, satisfaction);
      res.json({ success: true, conversation: updatedConversation });
    } catch (error) {
      console.error("Feedback error:", error);
      res.status(500).json({ message: "Failed to record feedback" });
    }
  });

  // Analytics routes
  app.post("/api/analytics/event", async (req, res) => {
    try {
      const { eventType, page, data, sessionId } = req.body;
      
      const event = await dbStorage.createAnalyticsEvent({
        eventType,
        page,
        data: data || {},
        sessionId,
        userAgent: req.headers['user-agent'] || '',
        ipAddress: req.ip || '',
        referrer: req.headers.referer || ''
      });
      
      res.json(event);
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ message: "Failed to record analytics event" });
    }
  });

  app.get("/api/analytics/summary", requireAdminAuth, async (req, res) => {
    try {
      const summary = await dbStorage.getAnalyticsSummary();
      res.json(summary);
    } catch (error) {
      console.error("Analytics summary error:", error);
      res.status(500).json({ message: "Failed to get analytics summary" });
    }
  });

  // CMS routes for admin
  app.get("/api/cms/content", requireAdminAuth, async (req, res) => {
    try {
      const content = await dbStorage.getCmsContent();
      res.json(content);
    } catch (error) {
      console.error("CMS content error:", error);
      res.status(500).json({ message: "Failed to fetch CMS content" });
    }
  });

  app.post("/api/cms/content", requireAdminAuth, async (req, res) => {
    try {
      const contentData = insertCmsContentSchema.parse(req.body);
      const content = await dbStorage.createCmsContent(contentData);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content data", errors: error.errors });
      }
      console.error("CMS creation error:", error);
      res.status(500).json({ message: "Failed to create CMS content" });
    }
  });

  app.put("/api/cms/content/:key", requireAdminAuth, async (req, res) => {
    try {
      const { key } = req.params;
      const content = await dbStorage.updateCmsContent(key, req.body);
      res.json(content);
    } catch (error) {
      console.error("CMS update error:", error);
      res.status(500).json({ message: "Failed to update CMS content" });
    }
  });

  // Client portal routes
  app.get("/api/client/projects", requireClientAuth, async (req, res) => {
    try {
      const clientId = (req as any).clientId;
      const projects = await dbStorage.getClientProjects(clientId);
      res.json(projects);
    } catch (error) {
      console.error("Client projects error:", error);
      res.status(500).json({ message: "Failed to fetch client projects" });
    }
  });

  app.get("/api/client/project/:id", requireClientAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const project = await dbStorage.getClientProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Client project error:", error);
      res.status(500).json({ message: "Failed to fetch client project" });
    }
  });

  // Admin routes for client management
  app.get("/api/admin/clients", requireAdminAuth, async (req, res) => {
    try {
      const clients = await dbStorage.getClients();
      res.json(clients);
    } catch (error) {
      console.error("Admin clients error:", error);
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.post("/api/admin/clients", requireAdminAuth, async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await dbStorage.createClient(clientData);
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid client data", errors: error.errors });
      }
      console.error("Admin client creation error:", error);
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.get("/api/admin/projects", requireAdminAuth, async (req, res) => {
    try {
      const projects = await dbStorage.getClientProjects();
      res.json(projects);
    } catch (error) {
      console.error("Admin projects error:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/admin/projects", requireAdminAuth, async (req, res) => {
    try {
      const projectData = insertClientProjectSchema.parse(req.body);
      const project = await dbStorage.createClientProject(projectData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Admin project creation error:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/admin/projects/:id", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const project = await dbStorage.updateClientProject(id, req.body);
      res.json(project);
    } catch (error) {
      console.error("Admin project update error:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });
}