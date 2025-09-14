import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PropertySearch } from "@/components/property/PropertySearch";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Loading } from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, HeadphonesIcon, Users, Home, Building, Sparkles } from "lucide-react";
import { PropertySearchForm } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { data: featuredProperties, isLoading } = useQuery({
    queryKey: ["/api/properties/featured"],
  });

  const handleSearch = (filters: PropertySearchForm) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString());
      }
    });
    window.location.href = `/search?${params.toString()}`;
  };

  const handleCategoryFilter = (category: string) => {
    window.location.href = `/search?propertyType=${category}`;
  };

  const categories = [
    {
      id: "shared_room",
      name: "Shared Rooms",
      price: "From $50/month",
      icon: Users,
      color: "bg-primary/10 text-primary hover:bg-primary/20"
    },
    {
      id: "private_room", 
      name: "Private Rooms",
      price: "From $150/month",
      icon: Home,
      color: "bg-accent/10 text-accent hover:bg-accent/20"
    },
    {
      id: "studio",
      name: "Studio Apartments",
      price: "From $300/month", 
      icon: Building,
      color: "bg-chart-3/10 text-chart-3 hover:bg-chart-3/20"
    },
    {
      id: "homestay",
      name: "Homestays",
      price: "From $200/month",
      icon: Sparkles,
      color: "bg-chart-4/10 text-chart-4 hover:bg-chart-4/20"
    }
  ];

  const trustFeatures = [
    {
      icon: Shield,
      title: "Verified Properties",
      description: "Every listing is personally verified by our team to ensure quality and safety standards"
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "All payments are held in escrow until move-in, with partial payment options for students"
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support", 
      description: "Round-the-clock customer support in multiple languages and local assistance"
    }
  ];

  return (
    <div data-testid="page-home">
      {/* Hero Section */}
      <section
        className="relative h-[600px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://pixabay.com/get/g212b179f1ac5b41792bfb97d7a95ad41baa7a227eda71d7993ad6b4e4fd164406fed7402053af2618935d217a7e122a4c69432a3aabf6c6562f2dffc9cc9180a_1280.jpg')",
        }}
        data-testid="hero-section"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="hero-title">
              Find Your Perfect
              <span className="text-accent"> Student Home</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100" data-testid="hero-subtitle">
              Affordable, safe, and verified student accommodation across Africa and beyond
            </p>

            <PropertySearch onSearch={handleSearch} className="max-w-4xl mx-auto" />
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="py-12 bg-secondary" data-testid="categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground" data-testid="categories-title">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => handleCategoryFilter(category.id)}
                  data-testid={`category-${category.id}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${category.color}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-card-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{category.price}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16" data-testid="featured-properties-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-foreground" data-testid="featured-properties-title">
              Featured Properties
            </h2>
            <Link href="/search">
              <Button variant="link" className="text-primary hover:text-primary/80 font-medium" data-testid="view-all-properties">
                View All Properties →
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-2xl h-64 mb-4"></div>
                  <div className="space-y-3">
                    <div className="bg-muted h-4 rounded w-3/4"></div>
                    <div className="bg-muted h-4 rounded w-1/2"></div>
                    <div className="bg-muted h-4 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProperties?.properties?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="featured-properties-grid">
              {featuredProperties.properties.map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured properties available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 bg-secondary" data-testid="trust-safety-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="trust-safety-title">
              Why Students Trust VYNESTO
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="trust-safety-subtitle">
              We ensure every property is verified, every payment is secure, and every student has support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center" data-testid={`trust-feature-${index}`}>
                  <div className="w-20 h-20 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-10 h-10 text-chart-3" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6" data-testid="cta-title">
            Ready to Find Your Student Home?
          </h2>
          <p className="text-xl mb-8 opacity-90" data-testid="cta-subtitle">
            Join thousands of students who have found safe, affordable accommodation through VYNESTO
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                data-testid="cta-browse-properties"
              >
                Browse Properties
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold"
              onClick={() => setAuthModalOpen(true)}
              data-testid="cta-sign-up"
            >
              Sign Up Today
            </Button>
          </div>
        </div>
      </section>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
