import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Bed, Bath, Users } from "lucide-react";
import { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (propertyId: string) => void;
  isFavorite?: boolean;
}

export function PropertyCard({ property, onFavoriteToggle, isFavorite = false }: PropertyCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(property.id);
  };

  const getBudgetClassColor = (budgetClass: string) => {
    switch (budgetClass) {
      case "low":
        return "bg-primary/10 text-primary";
      case "middle":
        return "bg-chart-3/10 text-chart-3";
      case "high":
        return "bg-chart-4/10 text-chart-4";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const getBudgetClassLabel = (budgetClass: string) => {
    switch (budgetClass) {
      case "low":
        return "Low Class";
      case "middle":
        return "Middle Class";
      case "high":
        return "High Class";
      default:
        return budgetClass;
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return `$${numPrice.toFixed(0)}`;
  };

  const getMainImage = () => {
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    // Fallback images based on property type
    switch (property.type) {
      case "shared_room":
        return "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
      case "private_room":
        return "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
      case "studio":
      case "apartment":
        return "https://images.unsplash.com/photo-1555636222-cae831e670b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
      case "homestay":
        return "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
      default:
        return "https://images.unsplash.com/photo-1555636222-cae831e670b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
    }
  };

  return (
    <Link href={`/property/${property.id}`}>
      <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300" data-testid={`card-property-${property.id}`}>
        <div className="relative">
          <img
            src={getMainImage()}
            alt={property.title}
            className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
            data-testid={`img-property-${property.id}`}
          />
          
          {/* Status badges */}
          <div className="absolute top-4 left-4 space-y-2">
            {property.status === "approved" && property.isAvailable && (
              <Badge className="bg-chart-3 text-white" data-testid={`badge-available-${property.id}`}>
                Available
              </Badge>
            )}
            {parseFloat(property.rating || "0") >= 4.5 && (
              <Badge className="bg-accent text-accent-foreground" data-testid={`badge-featured-${property.id}`}>
                Featured
              </Badge>
            )}
          </div>

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg"
            onClick={handleFavoriteClick}
            data-testid={`button-favorite-${property.id}`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </Button>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-card-foreground line-clamp-1" data-testid={`text-title-${property.id}`}>
              {property.title}
            </h3>
            {parseFloat(property.rating || "0") > 0 && (
              <div className="flex items-center" data-testid={`rating-${property.id}`}>
                <Star className="w-4 h-4 text-accent fill-current mr-1" />
                <span className="text-sm font-medium">{parseFloat(property.rating || "0").toFixed(1)}</span>
              </div>
            )}
          </div>

          <p className="text-muted-foreground mb-4 line-clamp-1" data-testid={`text-location-${property.id}`}>
            {property.city}, {property.country}
          </p>

          {/* Property details */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center" data-testid={`detail-beds-${property.id}`}>
                <Bed className="w-4 h-4 mr-1" />
                <span>{property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center" data-testid={`detail-baths-${property.id}`}>
                <Bath className="w-4 h-4 mr-1" />
                <span>{property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center" data-testid={`detail-capacity-${property.id}`}>
                <Users className="w-4 h-4 mr-1" />
                <span>{property.capacity}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary" data-testid={`text-price-${property.id}`}>
                {formatPrice(property.pricePerMonth)}
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>

          {/* Budget class and availability */}
          <div className="flex items-center justify-between">
            <Badge className={getBudgetClassColor(property.budgetClass)} data-testid={`badge-budget-${property.id}`}>
              {getBudgetClassLabel(property.budgetClass)}
            </Badge>
            <span className="text-sm text-muted-foreground" data-testid={`text-availability-${property.id}`}>
              {property.isAvailable ? "Available Now" : "Not Available"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
