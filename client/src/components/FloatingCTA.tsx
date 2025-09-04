import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, ThumbsUp, ThumbsDown } from 'lucide-react';
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
      content: "Hello! I'm here to help you learn about Ikonnect Service's digital solutions. How can I assist you today?",
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
      const response = await apiRequest('/api/chat', 'POST', {
        message: userMessage,
        sessionId,
        context: {
          previousMessages: messages.slice(-5) // Send last 5 messages for context
        }
      });
      return response;
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
    onError: () => {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again or contact our team directly.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const satisfactionMutation = useMutation({
    mutationFn: async ({ conversationId, satisfaction }: { conversationId: string; satisfaction: number }) => {
      return apiRequest('/api/chat/feedback', 'POST', {
        conversationId,
        satisfaction
      });
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

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Interface */}
      {isOpen && (
        <Card className="mb-4 w-96 h-[500px] bg-card border-primary/30 shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-primary">AI Assistant</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
                data-testid="button-close-chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[400px]">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                    data-testid={`message-${message.role}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-4'
                          : 'bg-muted text-foreground mr-4'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      {message.role === 'assistant' && message.conversationId && (
                        <div className="flex gap-2 mt-3 pt-2 border-t border-muted-foreground/20">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs hover:bg-muted/50"
                            onClick={() => handleSatisfactionFeedback(message.conversationId!, 1)}
                            data-testid="button-feedback-positive"
                          >
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Helpful
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs hover:bg-muted/50"
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
                  <div className="flex justify-start" data-testid="typing-indicator">
                    <div className="bg-muted text-foreground rounded-2xl px-4 py-3 mr-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-background"
                  disabled={chatMutation.isPending}
                  data-testid="input-chat-message"
                />
                <Button 
                  onClick={handleSendMessage} 
                  size="sm"
                  disabled={!input.trim() || chatMutation.isPending}
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Floating Chat Button */}
      <div className="w-14 h-14 flex-shrink-0">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 glow-effect hover:scale-110 transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="floating-cta-button"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}