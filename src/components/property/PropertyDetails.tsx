import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PropertyGallery } from "./PropertyGallery";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { Loading } from "@/components/ui/Loading";
import { 
  Heart, 
  Star, 
  Bed, 
  Bath, 
  Users, 
  Maximize, 
  MapPin,
  Check,
  Camera
} from "lucide-react";
import { formatPrice, getBudgetClassColor, getBudgetClassLabel, getPropertyTypeLabel } from "@/utils/helpers";
import { Property } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

interface PropertyDetailsProps {
  property: Property;
  onBookNow?: () => void;
  onContactOwner?: () => void;
}

export function PropertyDetails({ property, onBookNow, onContactOwner }: PropertyDetailsProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["/api/properties", property.id, "reviews"],
  });

  const reviews = reviewsData?.reviews || [];
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const mainImage = property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800";

  const amenitiesList = property.amenities || [];

  return (
    <div className="space-y-8" data-testid="property-details">
      {/* Image Gallery */}
      <div className="relative h-80 rounded-2xl overflow-hidden">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover"
          data-testid="property-main-image"
        />
        {property.images && property.images.length > 1 && (
          <Button
            className="absolute bottom-4 left-4 bg-white text-foreground hover:bg-gray-50"
            onClick={() => setGalleryOpen(true)}
            data-testid="button-view-gallery"
          >
            <Camera className="w-4 h-4 mr-2" />
            View all {property.images.length} photos
          </Button>
        )}
      </div>

      {/* Property Info */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-card-foreground" data-testid="property-title">
              {property.title}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              data-testid="button-favorite"
            >
              <Heart className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            {parseFloat(property.rating || "0") > 0 && (
              <div className="flex items-center" data-testid="property-rating">
                <Star className="w-5 h-5 text-accent fill-current mr-1" />
                <span className="font-semibold text-card-foreground mr-2">
                  {parseFloat(property.rating || "0").toFixed(1)}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground ml-2">
                  {property.reviewCount} review{property.reviewCount !== 1 ? "s" : ""}
                </span>
              </div>
            )}
            <span className="text-muted-foreground">·</span>
            <div className="flex items-center text-muted-foreground" data-testid="property-location">
              <MapPin className="w-4 h-4 mr-1" />
              {property.city}, {property.country}
            </div>
          </div>

          <div className="flex items-center space-x-6 text-muted-foreground">
            <div className="flex items-center" data-testid="property-beds">
              <Bed className="w-5 h-5 mr-2" />
              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center" data-testid="property-baths">
              <Bath className="w-5 h-5 mr-2" />
              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center" data-testid="property-capacity">
              <Users className="w-5 h-5 mr-2" />
              <span>{property.capacity} guest{property.capacity !== 1 ? "s" : ""}</span>
            </div>
            {property.size && (
              <div className="flex items-center" data-testid="property-size">
                <Maximize className="w-5 h-5 mr-2" />
                <span>{property.size} sq ft</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-card-foreground mb-4" data-testid="about-title">
                About this place
              </h2>
              <p className="text-muted-foreground leading-relaxed" data-testid="property-description">
                {property.description}
              </p>
            </div>

            {/* Property Type & Budget Class */}
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">Property Details</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" data-testid="property-type">
                  {getPropertyTypeLabel(property.type)}
                </Badge>
                <Badge className={getBudgetClassColor(property.budgetClass)} data-testid="property-budget-class">
                  {getBudgetClassLabel(property.budgetClass)}
                </Badge>
                {property.isAvailable && (
                  <Badge className="bg-chart-3/10 text-chart-3" data-testid="property-availability">
                    Available Now
                  </Badge>
                )}
              </div>
            </div>

            {/* Amenities */}
            {amenitiesList.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-card-foreground mb-4" data-testid="amenities-title">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {amenitiesList.map((amenity, index) => (
                    <div key={index} className="flex items-center" data-testid={`amenity-${index}`}>
                      <Check className="w-5 h-5 text-chart-3 mr-3" />
                      <span className="text-card-foreground">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-card-foreground" data-testid="reviews-title">
                  Reviews
                  {reviews.length > 0 && (
                    <span className="text-muted-foreground ml-2">({reviews.length})</span>
                  )}
                </h2>
                {reviews.length > 3 && (
                  <Button
                    variant="link"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    data-testid="button-toggle-reviews"
                  >
                    {showAllReviews ? "Show less" : `Show all ${reviews.length} reviews`}
                  </Button>
                )}
              </div>

              {reviewsLoading ? (
                <Loading text="Loading reviews..." />
              ) : reviews.length > 0 ? (
                <div className="space-y-6" data-testid="reviews-list">
                  {displayedReviews.map((review: any) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet.</p>
              )}

              {/* Add Review Form */}
              {isAuthenticated && user?.role === "student" && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
                  <ReviewForm 
                    propertyId={property.id}
                    onSuccess={() => {
                      // Refetch reviews
                      window.location.reload();
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6" data-testid="booking-card">
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <span className="text-3xl font-bold text-card-foreground" data-testid="property-price">
                        {formatPrice(property.pricePerMonth)}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <Badge className={getBudgetClassColor(property.budgetClass)}>
                      {getBudgetClassLabel(property.budgetClass)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Payment plans available for all students
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Security deposit: {formatPrice(property.securityDeposit)}
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={onBookNow}
                    disabled={!property.isAvailable}
                    data-testid="button-book-now"
                  >
                    {property.isAvailable ? "Reserve Now" : "Not Available"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={onContactOwner}
                    data-testid="button-contact-owner"
                  >
                    Message Owner
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Payment held in escrow until move-in. No charges until confirmed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {property.images && (
        <PropertyGallery
          images={property.images}
          title={property.title}
          open={galleryOpen}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </div>
  );
}
