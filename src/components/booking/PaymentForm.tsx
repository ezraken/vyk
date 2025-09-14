import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/Loading";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatPrice, getBudgetClassColor, getBudgetClassLabel } from "@/utils/helpers";
import { Shield, CreditCard, CheckCircle } from "lucide-react";
import { Property, Booking } from "@shared/schema";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface BookingWithProperty extends Booking {
  property: Property;
}

interface PaymentFormProps {
  booking: BookingWithProperty;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function PaymentFormInner({ booking, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const confirmPaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await apiRequest("POST", `/api/payments/${paymentId}/confirm`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed!",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Payment Confirmation Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment succeeded, update booking status
        // Note: In a real app, you'd typically handle this via webhooks
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully!",
        });
        onSuccess?.();
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const { property } = booking;

  return (
    <div className="max-w-4xl mx-auto space-y-8" data-testid="payment-form">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="payment-title">
          Complete Your Payment
        </h1>
        <p className="text-muted-foreground" data-testid="payment-subtitle">
          Secure your booking for {property.title}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" data-testid="payment-card-title">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Stripe Payment Element */}
                <div className="p-4 border rounded-lg">
                  <PaymentElement />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    disabled={!stripe || isProcessing}
                    data-testid="button-complete-payment"
                  >
                    {isProcessing ? (
                      <>
                        <Loading size="sm" className="mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        Complete Secure Payment
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={onCancel}
                    disabled={isProcessing}
                    data-testid="button-cancel-payment"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Security Notice */}
                <div className="bg-secondary rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-chart-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-card-foreground mb-1">
                        Your payment is protected
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        We use industry-standard encryption and your payment is held in escrow 
                        until your move-in date. You can cancel within 24 hours for a full refund.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6" data-testid="payment-summary">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Property Details */}
              <div>
                <h3 className="font-medium line-clamp-2" data-testid="summary-property-title">
                  {property.title}
                </h3>
                <p className="text-sm text-muted-foreground" data-testid="summary-property-location">
                  {property.city}, {property.country}
                </p>
                <Badge className={`${getBudgetClassColor(property.budgetClass)} mt-2`}>
                  {getBudgetClassLabel(property.budgetClass)}
                </Badge>
              </div>

              <Separator />

              {/* Booking Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span data-testid="summary-check-in">
                    {new Date(booking.checkIn).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span data-testid="summary-check-out">
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Plan:</span>
                  <span className="capitalize" data-testid="summary-payment-plan">
                    {booking.paymentPlan.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount:</span>
                <span className="text-xl font-bold text-primary" data-testid="summary-total-amount">
                  {formatPrice(booking.totalAmount)}
                </span>
              </div>

              {/* Special Requests */}
              {booking.specialRequests && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium mb-1">Special Requests:</div>
                    <div className="text-sm text-muted-foreground bg-muted p-2 rounded" data-testid="summary-special-requests">
                      {booking.specialRequests}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function PaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Create payment intent when component mounts
  React.useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          amount: parseFloat(props.booking.totalAmount),
          bookingId: props.booking.id,
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        toast({
          title: "Payment Setup Failed",
          description: error.message || "Failed to initialize payment",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [props.booking.id, props.booking.totalAmount, toast]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8" data-testid="payment-loading">
        <Loading size="lg" text="Setting up secure payment..." />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center" data-testid="payment-error">
        <h2 className="text-xl font-semibold text-foreground mb-2">Payment Setup Failed</h2>
        <p className="text-muted-foreground">Unable to initialize payment. Please try again.</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
          data-testid="button-retry-payment"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentFormInner {...props} />
    </Elements>
  );
}
