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
    // Convert messages to Gemini format with comprehensive business context
    const systemPrompt = `You are an AI assistant for Ikonnect Service, a leading digital innovation company. Here's comprehensive information about our business:

COMPANY OVERVIEW:
Ikonnect Service is a digital innovation leader that transforms businesses with AI-powered solutions. We create cutting-edge digital experiences that drive growth and innovation for modern businesses.

OUR CORE SERVICES:

1. DATA AUTOMATION
- Streamline workflows with intelligent data processing
- Automated reporting systems that save time and reduce errors
- Seamless integrations between different business systems
- Custom workflow automation solutions

2. WEB DEVELOPMENT  
- Custom web applications built with modern technologies
- Performance optimization and scalability solutions
- Exceptional user experience design
- Full-stack development expertise

3. AI CHATBOTS & INTEGRATION
- Intelligent conversational AI solutions
- Enhanced customer service automation
- Seamless integration with existing systems
- 24/7 automated support capabilities

4. WEB EXTRACTION
- Advanced web scraping and data extraction
- Process and analyze valuable information from online sources
- Data mining and collection services
- Automated data gathering solutions

5. GRAPHIC DESIGNING
- Creative visual solutions and branding
- Professional UI/UX design
- Marketing materials and digital assets
- Visual content that captivates audiences

COMPANY ACHIEVEMENTS:
- 500+ Projects Successfully Delivered
- 200+ Happy Clients Worldwide  
- 5+ Years of Industry Experience
- 99% Client Satisfaction Rate

OUR APPROACH:
We focus on AI-powered digital solutions that transform businesses. From data automation to AI chatbots, we create innovative experiences that drive real results.

WHEN RESPONDING:
- Be helpful, professional, and knowledgeable about our services
- Provide specific details about how our services can solve problems
- For pricing or detailed project discussions, suggest contacting our team directly
- Highlight our experience and success rate when relevant
- Keep responses concise but informative

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
  } catch (error: any) {
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