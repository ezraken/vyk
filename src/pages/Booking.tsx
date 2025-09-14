import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookingForm } from "@/components/booking/BookingForm";
import { PaymentForm } from "@/components/booking/PaymentForm";
import { Loading, LoadingPage } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

type BookingStep = "form" | "payment" | "success";

export default function Booking() {
  const { propertyId } = useParams();
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<BookingStep>("form");
  const [bookingData, setBookingData] = useState<any>(null);

  const {
    data: propertyData,
    isLoading: propertyLoading,
    error,
  } = useQuery({
    queryKey: ["/api/properties", propertyId],
    enabled: !!propertyId,
  });

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    setLocation("/");
    return <LoadingPage />;
  }

  if (authLoading || propertyLoading) {
    return <LoadingPage />;
  }

  if (error || !propertyData?.property) {
    return (
      <div className="container mx-auto px-4 py-8" data-testid="booking-error">
        <ErrorMessage
          title="Property Not Found"
          message="The property you're trying to book doesn't exist or is no longer available."
          onRetry={() => window.history.back()}
        />
      </div>
    );
  }

  const property = propertyData.property;

  const handleBookingSuccess = (booking: any) => {
    setBookingData(booking);
    setStep("payment");
  };

  const handlePaymentSuccess = () => {
    setStep("success");
  };

  const handleBackToForm = () => {
    setStep("form");
    setBookingData(null);
  };

  const renderStep = () => {
    switch (step) {
      case "form":
        return (
          <BookingForm 
            property={property} 
            onSuccess={handleBookingSuccess}
          />
        );
      
      case "payment":
        if (!bookingData) {
          setStep("form");
          return null;
        }
        return (
          <PaymentForm
            booking={{ ...bookingData, property }}
            onSuccess={handlePaymentSuccess}
            onCancel={handleBackToForm}
          />
        );
      
      case "success":
        return (
          <div className="max-w-2xl mx-auto text-center space-y-8" data-testid="booking-success">
            <div className="w-20 h-20 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-chart-3" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="success-title">
                Booking Confirmed!
              </h1>
              <p className="text-xl text-muted-foreground mb-6" data-testid="success-subtitle">
                Your payment has been processed and your booking is confirmed.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
                <div className="space-y-3 text-sm text-muted-foreground text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>You'll receive a confirmation email with all booking details</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>The property owner will contact you within 24 hours</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>Your payment is held securely until move-in date</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>You can manage your booking from your dashboard</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/student">
                <Button size="lg" data-testid="view-dashboard">
                  View My Dashboard
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" size="lg" data-testid="browse-more">
                  Browse More Properties
                </Button>
              </Link>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "form":
        return `Book ${property.title}`;
      case "payment":
        return "Complete Payment";
      case "success":
        return "Booking Successful";
      default:
        return "Booking";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" data-testid="booking-page">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          {step !== "success" && (
            <Link href={`/property/${propertyId}`}>
              <Button variant="ghost" size="sm" data-testid="back-to-property">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to property
              </Button>
            </Link>
          )}
        </div>
        
        <h1 className="text-3xl font-bold text-foreground" data-testid="booking-page-title">
          {getStepTitle()}
        </h1>
        
        {/* Progress Indicator */}
        {step !== "success" && (
          <div className="flex items-center space-x-2 mt-4" data-testid="booking-progress">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === "form" ? "bg-primary text-primary-foreground" : "bg-chart-3 text-white"
            }`}>
              1
            </div>
            <div className={`h-0.5 w-12 ${step === "payment" ? "bg-primary" : "bg-muted"}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              2
            </div>
            <div className="ml-4 text-sm text-muted-foreground">
              {step === "form" ? "Booking Details" : "Payment"}
            </div>
          </div>
        )}
      </div>

      {/* Step Content */}
      {renderStep()}
    </div>
  );
}
