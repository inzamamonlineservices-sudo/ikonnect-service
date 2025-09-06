import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Zap,
  Globe,
  Users,
  Award
} from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  serviceInterest: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      serviceInterest: "",
      message: "",
    },
  });

  const submitContact = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitContact.mutate(data);
  };

  const services = [
    "Data Automation",
    "Web Development", 
    "AI Chatbots & Integration",
    "Web Extraction",
    "Graphic Designing",
    "Custom Solutions"
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@ikonnectservice.com",
      link: "mailto:hello@ikonnectservice.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+92 320 4199398",
      link: "tel:+923204199398"
    },
    {
      icon: MapPin,
      label: "Address",
      value: "123 Innovation Street, Tech District, CA 90210",
      link: "#"
    },
    {
      icon: Clock,
      label: "Business Hours",
      value: "Mon - Fri: 9:00 AM - 6:00 PM PST",
      link: "#"
    }
  ];

  const reasons = [
    {
      icon: Zap,
      title: "Fast Response",
      description: "Get a response within 24 hours"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Work directly with our specialists"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Serving clients worldwide"
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "500+ successful projects delivered"
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-primary/10 border-primary/20 text-primary" data-testid="contact-badge">
            <MessageCircle className="w-4 h-4 mr-2" />
            Get In Touch
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="contact-title">
            Let's Work <span className="gradient-text">Together</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="contact-description">
            Ready to transform your business with cutting-edge digital solutions? 
            We'd love to hear about your project and discuss how we can help you achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="hover-lift" data-testid="contact-form-card">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="contact-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        {...form.register("name")}
                        placeholder="Your full name"
                        data-testid="input-name"
                      />
                      {form.formState.errors.name && (
                        <p className="text-destructive text-sm mt-1">{form.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        placeholder="your.email@company.com"
                        data-testid="input-email"
                      />
                      {form.formState.errors.email && (
                        <p className="text-destructive text-sm mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="serviceInterest">Service Interest *</Label>
                    <Select onValueChange={(value) => form.setValue("serviceInterest", value)} data-testid="select-service">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service you're interested in" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.serviceInterest && (
                      <p className="text-destructive text-sm mt-1">{form.formState.errors.serviceInterest.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">Project Details *</Label>
                    <Textarea
                      id="message"
                      {...form.register("message")}
                      placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                      rows={6}
                      data-testid="textarea-message"
                    />
                    {form.formState.errors.message && (
                      <p className="text-destructive text-sm mt-1">{form.formState.errors.message.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full glow-effect"
                    disabled={submitContact.isPending}
                    data-testid="submit-contact-form"
                  >
                    {submitContact.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">What happens next?</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      We'll review your message within 24 hours
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-chart-2 rounded-full mr-3"></div>
                      Schedule a free consultation call
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-chart-3 rounded-full mr-3"></div>
                      Receive a custom proposal and timeline
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card className="hover-lift" data-testid="contact-info-card">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start" data-testid={`contact-info-${index}`}>
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-card-foreground">{info.label}</div>
                        {info.link !== "#" ? (
                          <a href={info.link} className="text-muted-foreground hover:text-primary transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <div className="text-muted-foreground">{info.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Why Choose Us */}
            <Card className="hover-lift" data-testid="why-choose-card">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold mb-6">Why Choose Us?</h2>
                <div className="space-y-4">
                  {reasons.map((reason, index) => (
                    <div key={index} className="flex items-center" data-testid={`reason-${index}`}>
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                        <reason.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-card-foreground">{reason.title}</div>
                        <div className="text-sm text-muted-foreground">{reason.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="hover-lift" data-testid="quick-actions-card">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" asChild data-testid="quick-action-portfolio">
                    <a href="/portfolio">
                      <Globe className="w-4 h-4 mr-2" />
                      View Our Portfolio
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild data-testid="quick-action-services">
                    <a href="/services">
                      <Zap className="w-4 h-4 mr-2" />
                      Explore Our Services
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="quick-action-call">
                    <Phone className="w-4 h-4 mr-2" />
                    Schedule a Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="hover-lift" data-testid="faq-section">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question: "How long does a typical project take?",
                  answer: "Project timelines vary based on complexity. Simple websites take 2-4 weeks, while complex applications can take 2-6 months. We'll provide a detailed timeline after our initial consultation."
                },
                {
                  question: "Do you provide ongoing support?",
                  answer: "Yes! We offer comprehensive support and maintenance packages to keep your solutions running smoothly. This includes updates, bug fixes, and performance monitoring."
                },
                {
                  question: "What technologies do you specialize in?",
                  answer: "We work with modern technologies including React, Node.js, Python, AI/ML frameworks, cloud platforms (AWS, Azure), and various automation tools."
                },
                {
                  question: "Can you work with our existing systems?",
                  answer: "Absolutely! We specialize in integrating new solutions with existing infrastructure. We'll assess your current setup and design solutions that work seamlessly with your systems."
                },
                {
                  question: "How do you ensure project success?",
                  answer: "We follow agile methodologies with regular check-ins, transparent communication, and iterative development. You'll be involved throughout the process to ensure we meet your expectations."
                },
                {
                  question: "Do you offer free consultations?",
                  answer: "Yes, we provide free initial consultations to understand your needs and discuss how we can help. This includes a preliminary project assessment and recommendations."
                }
              ].map((faq, index) => (
                <div key={index} className="space-y-3" data-testid={`faq-${index}`}>
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
