import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { PortfolioItem } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Tag,
  Clock,
  Award
} from "lucide-react";

export default function PortfolioDetail() {
  const [, params] = useRoute("/portfolio/:id");
  const projectId = params?.id;

  const { data: project, isLoading } = useQuery<PortfolioItem>({
    queryKey: [`/api/portfolio/${projectId}`],
    enabled: !!projectId,
  });

  const { data: allProjects = [] } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/portfolio">Back to Portfolio</Link>
          </Button>
        </div>
      </div>
    );
  }

  const relatedProjects = allProjects
    .filter((item: PortfolioItem) => item.id !== project.id && item.category === project.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="container mx-auto px-6 pt-8">
        <Button variant="ghost" asChild data-testid="back-to-portfolio">
          <Link href="/portfolio">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 bg-primary/10 border-primary/20 text-primary capitalize" data-testid="project-category">
                {project.category.replace('-', ' ')}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="project-title">
                {project.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8" data-testid="project-description">
                {project.description}
              </p>
              
              {/* Project Meta */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {project.client && (
                  <div className="flex items-center" data-testid="project-client">
                    <User className="w-5 h-5 text-primary mr-2" />
                    <div>
                      <div className="text-sm text-muted-foreground">Client</div>
                      <div className="font-semibold">{project.client}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center" data-testid="project-year">
                  <Calendar className="w-5 h-5 text-primary mr-2" />
                  <div>
                    <div className="text-sm text-muted-foreground">Year</div>
                    <div className="font-semibold">{project.year}</div>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center" data-testid="technologies-title">
                  <Tag className="w-5 h-5 mr-2" />
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: string, index: number) => (
                    <Badge key={index} variant="secondary" data-testid={`technology-${index}`}>
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src={project.imageUrl} 
                alt={project.title}
                className="rounded-xl shadow-2xl w-full"
                data-testid="project-hero-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Process */}
              {project.process && (
                <Card className="hover-lift" data-testid="project-process">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mr-4">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">Development Process</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.process}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Results */}
              {project.results && (
                <Card className="hover-lift" data-testid="project-results">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-chart-2/20 rounded-lg flex items-center justify-center mr-4">
                        <TrendingUp className="w-6 h-6 text-chart-2" />
                      </div>
                      <h2 className="text-2xl font-bold">Project Results</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.results}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Full Description */}
            <Card className="mt-12 hover-lift" data-testid="project-full-description">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="leading-relaxed">
                    This project represents a comprehensive approach to {project.category.replace('-', ' ')} solutions, 
                    showcasing our ability to deliver high-quality results that exceed client expectations. 
                    Through careful planning, innovative technology implementation, and close collaboration with our client, 
                    we were able to achieve remarkable outcomes.
                  </p>
                  <p className="leading-relaxed mt-4">
                    The project involved multiple phases of development, from initial consultation and requirements gathering 
                    to final deployment and ongoing support. Our team utilized cutting-edge technologies and industry best 
                    practices to ensure the solution was not only effective but also scalable and maintainable.
                  </p>
                  {project.results && (
                    <p className="leading-relaxed mt-4">
                      <strong>Key Achievement:</strong> {project.results}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Project Tags */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6" data-testid="project-tags-title">Project Tags</h3>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-sm py-2 px-4" data-testid={`project-tag-${index}`}>
                    <Tag className="w-3 h-3 mr-2" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="related-projects-title">
                Related <span className="gradient-text">Projects</span>
              </h2>
              <p className="text-lg text-muted-foreground" data-testid="related-projects-description">
                Explore more projects in the {project.category.replace('-', ' ')} category
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((item: any, index: number) => (
                <Card key={item.id} className="overflow-hidden hover-lift cursor-pointer group" data-testid={`related-project-${index}`}>
                  <Link href={`/portfolio/${item.id}`}>
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="capitalize">
                          {item.category.replace('-', ' ')}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{item.year}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                        View Project
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-chart-2/10 to-chart-3/10">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6" data-testid="cta-title">
              Inspired by Our <span className="gradient-text">Work</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8" data-testid="cta-description">
              Let's create something amazing together. Start your project today and join our growing list of successful clients.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="glow-effect" asChild data-testid="cta-start-project">
                <Link href="/contact">Start Your Project</Link>
              </Button>
              <Button variant="outline" size="lg" asChild data-testid="cta-view-services">
                <Link href="/services">
                  View Our Services
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
