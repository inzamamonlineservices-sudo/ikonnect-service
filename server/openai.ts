import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  context?: Record<string, any>
): Promise<string> {
  try {
    // System message to define the chatbot's role and knowledge
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are a helpful AI assistant for Ikonnect Service, a digital agency specializing in:
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
      
      Keep responses helpful, professional, and concise. If asked about pricing or specific project details, suggest they contact our team directly.`
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using gpt-4o as it's the most stable model currently available
      messages: [systemMessage, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I'm unable to generate a response right now. Please try again or contact our team directly.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    console.error("Error details:", error?.message);
    throw new Error("Failed to generate chat response");
  }
}

export async function analyzeChatSentiment(message: string): Promise<{
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "Analyze the sentiment of the following message and respond with JSON in this format: { \"sentiment\": \"positive\" | \"negative\" | \"neutral\", \"confidence\": number between 0 and 1 }"
        },
        {
          role: "user",
          content: message
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 100,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"sentiment": "neutral", "confidence": 0.5}');
    return {
      sentiment: result.sentiment || 'neutral',
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5))
    };
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return { sentiment: 'neutral', confidence: 0.5 };
  }
}