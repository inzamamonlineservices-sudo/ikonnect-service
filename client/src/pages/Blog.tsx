import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  Tag,
  Filter
} from "lucide-react";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ["/api/blog"],
  });

  const categories = [
    { id: "all", name: "All Posts", count: blogPosts.length },
    { id: "AI", name: "AI & Machine Learning", count: blogPosts.filter((post: any) => post.category === "AI").length },
    { id: "Web Dev", name: "Web Development", count: blogPosts.filter((post: any) => post.category === "Web Dev").length },
    { id: "Design", name: "Design", count: blogPosts.filter((post: any) => post.category === "Design").length },
    { id: "Automation", name: "Automation", count: blogPosts.filter((post: any) => post.category === "Automation").length },
    { id: "Industry Insights", name: "Industry Insights", count: blogPosts.filter((post: any) => post.category === "Industry Insights").length }
  ];

  const filteredPosts = blogPosts.filter((post: any) => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog posts...</p>
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
          <Badge variant="outline" className="mb-4 bg-primary/10 border-primary/20 text-primary" data-testid="blog-badge">
            <BookOpen className="w-4 h-4 mr-2" />
            Our Blog
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="blog-title">
            Latest <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="blog-description">
            Stay updated with the latest trends in AI, web development, automation, and digital innovation. 
            Our expert insights help you navigate the rapidly evolving digital landscape.
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
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="blog-search"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center"
                  data-testid={`filter-${category.id.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <Card className="text-center py-12" data-testid="no-posts">
            <CardContent>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or category filters.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("all");
                }}
                data-testid="clear-blog-filters"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Featured Post */}
            {filteredPosts.length > 0 && (
              <Card className="mb-12 overflow-hidden hover-lift cursor-pointer group" data-testid="featured-post">
                <Link href={`/blog/${filteredPosts[0].slug}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="aspect-video lg:aspect-auto overflow-hidden">
                      <img 
                        src={filteredPosts[0].imageUrl} 
                        alt={filteredPosts[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-8 flex flex-col justify-center">
                      <Badge variant="secondary" className="w-fit mb-4">
                        {filteredPosts[0].category}
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-card-foreground group-hover:text-primary transition-colors">
                        {filteredPosts[0].title}
                      </h2>
                      <p className="text-muted-foreground mb-6 text-lg">
                        {filteredPosts[0].excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="w-4 h-4 mr-2" />
                          {filteredPosts[0].author}
                          <span className="mx-2">•</span>
                          <Clock className="w-4 h-4 mr-1" />
                          {filteredPosts[0].readTime}
                        </div>
                        <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Link>
              </Card>
            )}

            {/* Regular Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(1).map((post: any, index: number) => (
                <Card key={post.id} className="overflow-hidden hover-lift cursor-pointer group" data-testid={`blog-post-${index + 1}`}>
                  <Link href={`/blog/${post.slug}`}>
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">
                          {post.category}
                        </Badge>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 2).map((tag: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="w-4 h-4 mr-1" />
                          {post.author}
                          <span className="mx-2">•</span>
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </div>
                        <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Load More */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              Showing {filteredPosts.length} posts
            </p>
            <Button variant="outline" size="lg" data-testid="load-more-posts">
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
