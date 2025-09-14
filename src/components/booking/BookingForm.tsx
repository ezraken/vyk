import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CreditCard, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatPrice, calculateMonthsStay, validateDates, getBudgetClassColor, getBudgetClassLabel } from "@/utils/helpers";
import { Property } from "@shared/schema";

const bookingSchema = z.object({
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  paymentPlan: z.enum(["full", "monthly", "semester", "student_loan"], {
    required_error: "Please select a payment plan"
  }),
  specialRequests: z.string().max(500, "Special requests must be less than 500 characters").optional(),
}).refine((data) => {
  const validation = validateDates(data.checkIn, data.checkOut);
  return validation.valid;
}, {
  message: "Invalid date selection",
  path: ["checkOut"]
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  property: Property;
  onSuccess?: (bookingId: string) => void;
}

export function BookingForm({ property, onSuccess }: BookingFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: "",
      checkOut: "",
      paymentPlan: "full",
      specialRequests: "",
    },
  });

  const watchedValues = form.watch();
  const monthsStay = watchedValues.checkIn && watchedValues.checkOut 
    ? calculateMonthsStay(watchedValues.checkIn, watchedValues.checkOut)
    : 1;

  // Calculate pricing
  const monthlyRent = parseFloat(property.pricePerMonth);
  const securityDeposit = parseFloat(property.securityDeposit);
  const platformFee = 25;
  const subtotal = monthlyRent * monthsStay;
  
  // Apply discount for full payment
  const discount = watchedValues.paymentPlan === "full" ? subtotal * 0.05 : 0;
  const totalAmount = subtotal + securityDeposit + platformFee - discount;

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await apiRequest("POST", "/api/bookings", {
        propertyId: property.id,
        ...data,
        totalAmount: totalAmount.toString(),
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Booking created successfully",
        description: "Proceeding to payment...",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      onSuccess?.(data.booking.id);
    },
    onError: (error: any) => {
      toast({
        title: "Booking failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    const validation = validateDates(data.checkIn, data.checkOut);
    if (!validation.valid) {
      form.setError("checkOut", { message: validation.error });
      return;
    }

    setIsProcessing(true);
    try {
      await createBookingMutation.mutateAsync(data);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentPlanOptions = [
    { value: "full", label: "Full Payment (5% discount)", description: "Pay everything upfront and save 5%" },
    { value: "monthly", label: "Monthly Payments", description: "Pay monthly rent + fees" },
    { value: "semester", label: "Semester Payments", description: "Pay per semester" },
    { value: "student_loan", label: "Student Loan Assistance", description: "We'll work with your financial aid" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-testid="booking-form">
      {/* Booking Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center" data-testid="booking-form-title">
              <CalendarDays className="w-5 h-5 mr-2" />
              Book Your Stay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkIn" className="text-sm font-medium">
                    Check-in Date *
                  </Label>
                  <Input
                    id="checkIn"
                    type="date"
                    {...form.register("checkIn")}
                    min={new Date().toISOString().split('T')[0]}
                    data-testid="input-check-in"
                  />
                  {form.formState.errors.checkIn && (
                    <p className="text-sm text-destructive mt-1" data-testid="error-check-in">
                      {form.formState.errors.checkIn.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="checkOut" className="text-sm font-medium">
                    Check-out Date *
                  </Label>
                  <Input
                    id="checkOut"
                    type="date"
                    {...form.register("checkOut")}
                    min={watchedValues.checkIn || new Date().toISOString().split('T')[0]}
                    data-testid="input-check-out"
                  />
                  {form.formState.errors.checkOut && (
                    <p className="text-sm text-destructive mt-1" data-testid="error-check-out">
                      {form.formState.errors.checkOut.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Plan */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Payment Plan *
                </Label>
                <div className="space-y-3">
                  {paymentPlanOptions.map((option) => (
                    <div key={option.value} className="relative">
                      <input
                        type="radio"
                        id={option.value}
                        value={option.value}
                        {...form.register("paymentPlan")}
                        className="sr-only"
                        data-testid={`payment-plan-${option.value}`}
                      />
                      <label
                        htmlFor={option.value}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          watchedValues.paymentPlan === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-card-foreground">
                              {option.label}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {option.description}
                            </div>
                          </div>
                          {option.value === "full" && (
                            <Badge className="bg-chart-3/10 text-chart-3">
                              Save 5%
                            </Badge>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.paymentPlan && (
                  <p className="text-sm text-destructive mt-1" data-testid="error-payment-plan">
                    {form.formState.errors.paymentPlan.message}
                  </p>
                )}
              </div>

              {/* Special Requests */}
              <div>
                <Label htmlFor="specialRequests" className="text-sm font-medium">
                  Special Requests (Optional)
                </Label>
                <Textarea
                  id="specialRequests"
                  placeholder="Any special requests or requirements..."
                  className="mt-1"
                  {...form.register("specialRequests")}
                  data-testid="input-special-requests"
                />
                {form.formState.errors.specialRequests && (
                  <p className="text-sm text-destructive mt-1" data-testid="error-special-requests">
                    {form.formState.errors.specialRequests.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isProcessing || createBookingMutation.isPending}
                data-testid="button-proceed-booking"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {isProcessing || createBookingMutation.isPending 
                  ? "Processing..." 
                  : "Proceed to Payment"
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Booking Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6" data-testid="booking-summary">
          <CardHeader>
            <CardTitle className="text-lg">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Property Info */}
            <div>
              <h3 className="font-medium text-card-foreground line-clamp-2" data-testid="summary-property-title">
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

            {/* Stay Duration */}
            {watchedValues.checkIn && watchedValues.checkOut && (
              <div>
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="font-medium" data-testid="summary-duration">
                  {monthsStay} month{monthsStay !== 1 ? "s" : ""}
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly rent × {monthsStay}</span>
                <span data-testid="summary-rent">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Security deposit</span>
                <span data-testid="summary-deposit">{formatPrice(securityDeposit)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Platform fee</span>
                <span data-testid="summary-platform-fee">{formatPrice(platformFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-chart-3">
                  <span>Full payment discount (5%)</span>
                  <span data-testid="summary-discount">-{formatPrice(discount)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary" data-testid="summary-total">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-secondary rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-chart-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-card-foreground">
                    Secure Payment
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Payment held in escrow until move-in. No charges until confirmed.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
