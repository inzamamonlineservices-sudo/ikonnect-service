import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { PortfolioItem, Testimonial } from "@shared/schema";
import {
  Database,
  Code,
  MessageSquare,
  Search,
  Palette,
  Lightbulb,
  ArrowRight,
  Play,
  CheckCircle,
  Star
} from "lucide-react";

export default function Home() {
  const { data: portfolioItems = [] } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio?featured=true"],
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials?featured=true"],
  });

  const services = [
    {
      name: "Data Automation",
      description: "Streamline your workflows with intelligent data processing, automated reporting, and seamless integrations that save time and reduce errors.",
      icon: Database,
      color: "text-primary",
      href: "/services/data-automation"
    },
    {
      name: "Web Development",
      description: "Custom web applications built with modern technologies, optimized for performance, scalability, and exceptional user experiences.",
      icon: Code,
      color: "text-chart-2",
      href: "/services/web-development"
    },
    {
      name: "AI Chatbots & Integration",
      description: "Intelligent conversational AI solutions that enhance customer service, automate support, and integrate seamlessly with your systems.",
      icon: MessageSquare,
      color: "text-chart-3",
      href: "/services/ai-chatbots"
    },
    {
      name: "Web Extraction",
      description: "Advanced web scraping and data extraction solutions to gather, process, and analyze valuable information from any online source.",
      icon: Search,
      color: "text-chart-4",
      href: "/services/web-extraction"
    },
    {
      name: "Graphic Designing",
      description: "Creative visual solutions including branding, UI/UX design, marketing materials, and digital assets that captivate your audience.",
      icon: Palette,
      color: "text-chart-5",
      href: "/services/graphic-design"
    }
  ];

  const stats = [
    { label: "Projects Delivered", value: "500+" },
    { label: "Happy Clients", value: "200+" },
    { label: "Years Experience", value: "5+" },
    { label: "Satisfaction Rate", value: "99%" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted"></div>
        
        {/* 3D Animation Placeholder */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-chart-2/20 rounded-full blur-xl animate-float-delayed"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-chart-3/20 rounded-full blur-xl animate-float-slow"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Animated badge */}
            <Badge variant="outline" className="mb-8 bg-primary/10 border-primary/20 text-primary" data-testid="hero-badge">
              <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
              Digital Innovation Leaders
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" data-testid="hero-title">
              <span className="gradient-text">Transform</span> Your Business<br/>
              With <span className="gradient-text">AI-Powered</span><br/>
              Digital Solutions
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="hero-description">
              From data automation to AI chatbots, we create cutting-edge digital experiences that drive growth and innovation for modern businesses.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" className="glow-effect hover:scale-105 transition-all duration-300" asChild data-testid="hero-cta-primary">
                <Link href="/contact">Start Your Project</Link>
              </Button>
              <Button variant="outline" size="lg" className="flex items-center" data-testid="hero-cta-secondary">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center" data-testid={`stat-${index}`}>
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="about-title">
              Pioneering <span className="gradient-text">Digital Excellence</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="about-description">
              At Ikonnect Service, we're not just a digital agency—we're your partners in innovation. 
              We specialize in transforming complex business challenges into streamlined digital solutions 
              that drive measurable results and sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {[
                { icon: Lightbulb, text: "AI-Powered Solutions", color: "text-primary" },
                { icon: CheckCircle, text: "Proven Results", color: "text-chart-2" },
                { icon: Star, text: "Expert Team", color: "text-chart-3" }
              ].map((item, index) => (
                <div key={index} className="flex items-center" data-testid={`feature-${index}`}>
                  <div className={`w-12 h-12 bg-${item.color.split('-')[1]}/20 rounded-full flex items-center justify-center mr-4`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className="text-lg font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="services-title">
              Our <span className="gradient-text">Core Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="services-description">
              We offer comprehensive digital solutions designed to accelerate your business growth and streamline operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="service-card hover-lift cursor-pointer group bg-card border border-border/50" data-testid={`service-card-${index}`}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">{service.name}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <Link href={service.href} className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </CardContent>
              </Card>
            ))}
            
            {/* Custom Solutions Card */}
            <Card className="service-card hover-lift cursor-pointer group bg-card border-2 border-primary/30" data-testid="custom-solutions-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Custom Solutions</h3>
                <p className="text-muted-foreground mb-6">Need something unique? We create tailored digital solutions that perfectly match your specific business requirements and goals.</p>
                <Link href="/contact" className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                  Contact Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="portfolio-title">
              Featured <span className="gradient-text">Portfolio</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="portfolio-description">
              Explore our latest projects and see how we've helped businesses transform their digital presence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {portfolioItems.slice(0, 3).map((item: any, index: number) => (
              <Card key={item.id} className="overflow-hidden hover-lift cursor-pointer group bg-card border border-border/50" data-testid={`portfolio-item-${index}`}>
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{item.category.replace('-', ' ')}</Badge>
                    <span className="text-sm text-muted-foreground">{item.year}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <Link href={`/portfolio/${item.id}`} className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                    View Case Study
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" asChild data-testid="view-all-portfolio">
              <Link href="/portfolio">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="testimonials-title">
              What Our <span className="gradient-text">Clients Say</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="testimonials-description">
              Don't just take our word for it. Here's what our satisfied clients have to say about our work.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial: any, index: number) => (
              <Card key={testimonial.id} className="hover-lift bg-card border border-border/50" data-testid={`testimonial-${index}`}>
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground mb-6 text-lg leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    {testimonial.imageUrl && (
                      <img 
                        src={testimonial.imageUrl} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-muted-foreground text-sm">{testimonial.position}, {testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-chart-2/10 to-chart-3/10">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6" data-testid="cta-title">
              Ready to <span className="gradient-text">Transform</span><br/>
              Your Business?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="cta-description">
              Let's discuss how our innovative digital solutions can accelerate your growth and streamline your operations.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" className="glow-effect hover:scale-105 transition-all duration-300" asChild data-testid="cta-primary">
                <Link href="/contact">Start Your Project Today</Link>
              </Button>
              <Button variant="outline" size="lg" data-testid="cta-secondary">
                Schedule a Free Consultation
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-muted-foreground">
              {[
                "Free Initial Consultation",
                "Custom Solution Design", 
                "24/7 Support"
              ].map((feature, index) => (
                <div key={index} className="flex items-center" data-testid={`cta-feature-${index}`}>
                  <CheckCircle className="w-5 h-5 text-chart-2 mr-2" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
