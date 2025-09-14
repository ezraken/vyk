import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, Users, Bed, Bath } from "lucide-react";
import { formatPrice, formatDate, getBookingStatusColor, getBookingStatusLabel } from "@/utils/helpers";
import { Booking, Property } from "@shared/schema";

interface BookingWithProperty extends Booking {
  property: Property;
}

interface BookingCardProps {
  booking: BookingWithProperty;
  onViewDetails?: () => void;
  onCancel?: () => void;
  onMessage?: () => void;
}

export function BookingCard({ booking, onViewDetails, onCancel, onMessage }: BookingCardProps) {
  const { property } = booking;
  const canCancel = booking.status === "pending" || booking.status === "confirmed";

  const getMainImage = () => {
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    return "https://images.unsplash.com/photo-1555636222-cae831e670b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
  };

  return (
    <Card className="overflow-hidden" data-testid={`booking-card-${booking.id}`}>
      <div className="flex flex-col md:flex-row">
        {/* Property Image */}
        <div className="md:w-1/3">
          <img
            src={getMainImage()}
            alt={property.title}
            className="w-full h-48 md:h-full object-cover"
            data-testid="booking-property-image"
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl line-clamp-1" data-testid="booking-property-title">
                  {property.title}
                </CardTitle>
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm" data-testid="booking-property-location">
                    {property.city}, {property.country}
                  </span>
                </div>
              </div>
              <Badge className={getBookingStatusColor(booking.status)} data-testid="booking-status">
                {getBookingStatusLabel(booking.status)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Dates */}
              <div>
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <CalendarDays className="w-4 h-4 mr-1" />
                  Check-in & Check-out
                </div>
                <p className="font-medium" data-testid="booking-dates">
                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                </p>
              </div>

              {/* Property Details */}
              <div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    <span>{property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    <span>{property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{property.capacity}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="mb-4" />

            {/* Booking Summary */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Payment Plan</span>
                <span className="font-medium capitalize" data-testid="booking-payment-plan">
                  {booking.paymentPlan.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-lg font-bold text-primary" data-testid="booking-total-amount">
                  {formatPrice(booking.totalAmount)}
                </span>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-1">Special Requests</div>
                <p className="text-sm bg-muted p-3 rounded-lg" data-testid="booking-special-requests">
                  {booking.specialRequests}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="default" 
                size="sm"
                onClick={onViewDetails}
                data-testid="button-view-booking-details"
              >
                View Details
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={onMessage}
                data-testid="button-message-owner"
              >
                Message Owner
              </Button>
              
              {canCancel && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={onCancel}
                  data-testid="button-cancel-booking"
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
