import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { PortfolioItem } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  ArrowRight,
  Eye,
  Calendar,
  Tag
} from "lucide-react";

export default function Portfolio() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: portfolioItems = [], isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  const filters = [
    { id: "all", name: "All Projects", count: portfolioItems.length },
    { id: "web-dev", name: "Web Development", count: portfolioItems.filter((item: PortfolioItem) => item.category === "web-dev").length },
    { id: "automation", name: "Automation", count: portfolioItems.filter((item: PortfolioItem) => item.category === "automation").length },
    { id: "ai", name: "AI Solutions", count: portfolioItems.filter((item: PortfolioItem) => item.category === "ai").length },
    { id: "design", name: "Design", count: portfolioItems.filter((item: PortfolioItem) => item.category === "design").length }
  ];

  const filteredItems = portfolioItems.filter((item: PortfolioItem) => {
    const matchesFilter = activeFilter === "all" || item.category === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 bg-primary/10 border-primary/20 text-primary" data-testid="portfolio-badge">
            <Eye className="w-4 h-4 mr-2" />
            Our Portfolio
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="portfolio-title">
            Showcasing <span className="gradient-text">Digital Excellence</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="portfolio-description">
            Explore our collection of successful projects that demonstrate our expertise in delivering 
            innovative digital solutions across various industries and technologies.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="portfolio-search"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  onClick={() => setActiveFilter(filter.id)}
                  className="flex items-center"
                  data-testid={`filter-${filter.id}`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {filter.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        {filteredItems.length === 0 ? (
          <Card className="text-center py-12" data-testid="no-results">
            <CardContent>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filter options.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("all");
                }}
                data-testid="clear-filters"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item: any, index: number) => (
              <Card key={item.id} className="overflow-hidden hover-lift cursor-pointer group" data-testid={`portfolio-item-${index}`}>
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
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {item.year}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.slice(0, 3).map((tag: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Client Info */}
                    {item.client && (
                      <div className="text-sm text-muted-foreground mb-4">
                        Client: <span className="text-card-foreground font-medium">{item.client}</span>
                      </div>
                    )}

                    <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                      View Case Study
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredItems.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              Showing {filteredItems.length} of {portfolioItems.length} projects
            </p>
            <Button variant="outline" size="lg" data-testid="load-more">
              Load More Projects
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
