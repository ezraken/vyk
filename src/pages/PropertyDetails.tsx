import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { PropertyDetails as PropertyDetailsComponent } from "@/components/property/PropertyDetails";
import { Loading, LoadingPage } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { useState } from "react";

export default function PropertyDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const {
    data: propertyData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/properties", id],
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8" data-testid="property-details-error">
        <ErrorMessage
          title="Property Not Found"
          message="The property you're looking for doesn't exist or has been removed."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!propertyData?.property) {
    return (
      <div className="container mx-auto px-4 py-8" data-testid="property-not-found">
        <ErrorMessage
          title="Property Not Found"
          message="The property you're looking for doesn't exist or has been removed."
        />
        <div className="text-center mt-6">
          <Link href="/search">
            <Button variant="outline" data-testid="back-to-search">
              Browse Other Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const property = propertyData.property;

  const handleBookNow = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    window.location.href = `/booking/${property.id}`;
  };

  const handleContactOwner = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    // TODO: Open chat with owner
    console.log("Contact owner functionality not implemented yet");
  };

  return (
    <div data-testid="page-property-details">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/search">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground" data-testid="back-button">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to search
            </Button>
          </Link>
        </div>

        {/* Property Details */}
        <PropertyDetailsComponent
          property={property}
          onBookNow={handleBookNow}
          onContactOwner={handleContactOwner}
        />
      </div>

      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialTab="login"
      />
    </div>
  );
}
