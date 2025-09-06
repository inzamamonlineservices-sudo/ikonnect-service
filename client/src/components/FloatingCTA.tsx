import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, ThumbsUp, ThumbsDown, Bot, User, Sparkles } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  conversationId?: string;
}

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hello! I'm your AI assistant for Ikonnect Service. I can help you learn about our digital solutions including data automation, web development, AI chatbots, and more. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await apiRequest('POST', '/api/chat', {
        message: userMessage,
        sessionId,
        context: {
          previousMessages: messages.slice(-5) // Send last 5 messages for context
        }
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        conversationId: data.conversationId
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error: Error) => {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I apologize for the technical issue. Let me try to help you in a different way. You can also contact our team directly at info@ikonnectservice.com or use our contact form for immediate assistance.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const satisfactionMutation = useMutation({
    mutationFn: async ({ conversationId, satisfaction }: { conversationId: string; satisfaction: number }) => {
      const response = await apiRequest('POST', '/api/chat/feedback', {
        conversationId,
        satisfaction
      });
      return response.json();
    },
    onSuccess: () => {
      // Feedback recorded successfully
    }
  });

  const handleSendMessage = () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(input.trim());
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSatisfactionFeedback = (conversationId: string, satisfaction: number) => {
    satisfactionMutation.mutate({ conversationId, satisfaction });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickReplies = [
    "Tell me about your services",
    "How can you help my business?",
    "What's your pricing?",
    "Schedule a consultation"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Interface */}
      {isOpen && (
        <div className="mb-4 animate-in slide-in-from-bottom-5 duration-300">
          <Card className="w-96 h-[600px] bg-background/95 backdrop-blur-lg border-primary/20 shadow-2xl shadow-primary/10 rounded-3xl overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full animate-pulse" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">AI Assistant</CardTitle>
                    <p className="text-xs text-muted-foreground">Powered by Gemini AI</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-primary/10 rounded-full transition-colors"
                  data-testid="button-close-chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex flex-col h-[500px]">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-6 py-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      } animate-in fade-in-50 duration-300`}
                      data-testid={`message-${message.role}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-4 rounded-br-md'
                            : 'bg-gradient-to-br from-muted to-muted/80 text-foreground mr-4 rounded-bl-md border border-border/50'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' && (
                            <Bot className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                          )}
                          {message.role === 'user' && (
                            <User className="w-4 h-4 mt-0.5 text-primary-foreground/80 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-2 ${
                              message.role === 'user' 
                                ? 'text-primary-foreground/70' 
                                : 'text-muted-foreground'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                        
                        {message.role === 'assistant' && message.conversationId && (
                          <div className="flex gap-2 mt-3 pt-2 border-t border-border/30">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs hover:bg-background/50 rounded-full"
                              onClick={() => handleSatisfactionFeedback(message.conversationId!, 1)}
                              data-testid="button-feedback-positive"
                            >
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              Helpful
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs hover:bg-background/50 rounded-full"
                              onClick={() => handleSatisfactionFeedback(message.conversationId!, 0)}
                              data-testid="button-feedback-negative"
                            >
                              <ThumbsDown className="w-3 h-3 mr-1" />
                              Not helpful
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {chatMutation.isPending && (
                    <div className="flex justify-start animate-in fade-in-50 duration-300" data-testid="typing-indicator">
                      <div className="bg-gradient-to-br from-muted to-muted/80 text-foreground rounded-2xl px-4 py-3 mr-4 border border-border/50 rounded-bl-md">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-primary" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          </div>
                          <span className="text-xs text-muted-foreground">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              {/* Quick Replies */}
              {messages.length === 1 && !chatMutation.isPending && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs rounded-full border-primary/30 hover:bg-primary/10 transition-all duration-200"
                        onClick={() => {
                          setInput(reply);
                          handleSendMessage();
                        }}
                        data-testid={`quick-reply-${index}`}
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="p-4 border-t border-border/10 bg-gradient-to-t from-background/50 to-transparent">
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-background/80 border-primary/20 rounded-full px-4 focus:border-primary/40 transition-colors"
                    disabled={chatMutation.isPending}
                    data-testid="input-chat-message"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    size="sm"
                    disabled={!input.trim() || chatMutation.isPending}
                    className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Floating Chat Button */}
      <div className="w-14 h-14 flex-shrink-0">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-br from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-110 group relative overflow-hidden"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="floating-cta-button"
        >
          <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full animate-pulse" />
          )}
        </Button>
      </div>
    </div>
  );
}