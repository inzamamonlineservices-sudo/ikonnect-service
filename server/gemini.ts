import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  context?: Record<string, any>
): Promise<string> {
  try {
    // Convert messages to Gemini format (system + conversation)
    const systemPrompt = `You are a helpful AI assistant for Ikonnect Service, a digital agency specializing in:
- Data Automation (streamlined workflows, automated reporting, integrations)
- Web Development (custom applications, performance optimization, scalability)
- AI Chatbots & Integration (conversational AI, customer service automation)
- Web Extraction (web scraping, data extraction, processing)
- Graphic Design (branding, UI/UX, marketing materials)

You should help visitors with:
- Questions about our services
- General inquiries about projects
- Technical guidance and recommendations
- Scheduling consultations

Keep responses helpful, professional, and concise. If asked about pricing or specific project details, suggest they contact our team directly.

Recent conversation context: ${context ? JSON.stringify(context) : 'None'}`;

    // Build conversation history for Gemini
    const conversationText = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationText}\n\nAssistant:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    return response.text || "I apologize, but I'm unable to generate a response right now. Please try again or contact our team directly.";
  } catch (error) {
    console.error("Gemini API error:", error);
    console.error("Error details:", error?.message);
    throw new Error("Failed to generate chat response");
  }
}

export async function analyzeChatSentiment(message: string): Promise<{
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}> {
  try {
    const prompt = `Analyze the sentiment of the following message and respond with JSON in this format: {"sentiment": "positive" | "negative" | "neutral", "confidence": number between 0 and 1}

Message: "${message}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            sentiment: { type: "string" },
            confidence: { type: "number" },
          },
          required: ["sentiment", "confidence"],
        },
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || '{"sentiment": "neutral", "confidence": 0.5}');
    return {
      sentiment: result.sentiment || 'neutral',
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5))
    };
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return { sentiment: 'neutral', confidence: 0.5 };
  }
}