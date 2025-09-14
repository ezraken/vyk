import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCard } from "@/components/booking/BookingCard";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Loading } from "@/components/ui/Loading";
import { 
  Calendar, 
  Home, 
  Heart, 
  MessageSquare, 
  Star,
  CreditCard,
  MapPin,
  Plus
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, getBookingStatusColor, getPaymentStatusColor } from "@/utils/helpers";

export function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/bookings"],
  });

  const { data: favoritesData, isLoading: favoritesLoading } = useQuery({
    queryKey: ["/api/user/favorites"],
    enabled: false, // TODO: Implement favorites API
  });

  const bookings = bookingsData?.bookings || [];
  const activeBooking = bookings.find((b: any) => b.status === "confirmed");
  const upcomingBookings = bookings.filter((b: any) => b.status === "pending");

  return (
    <div className="space-y-8" data-testid="student-dashboard">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-2" data-testid="welcome-title">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-primary-foreground/80" data-testid="welcome-subtitle">
          Manage your bookings, discover new properties, and stay connected.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bookings</p>
                <p className="text-3xl font-bold text-foreground" data-testid="stat-active-bookings">
                  {bookings.filter((b: any) => b.status === "confirmed").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Home className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-3xl font-bold text-foreground" data-testid="stat-total-bookings">
                  {bookings.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favorite Properties</p>
                <p className="text-3xl font-bold text-foreground" data-testid="stat-favorites">
                  0
                </p>
              </div>
              <div className="w-12 h-12 bg-chart-4/10 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reviews Given</p>
                <p className="text-3xl font-bold text-foreground" data-testid="stat-reviews">
                  0
                </p>
              </div>
              <div className="w-12 h-12 bg-chart-3/10 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings" data-testid="tab-bookings">Bookings</TabsTrigger>
          <TabsTrigger value="favorites" data-testid="tab-favorites">Favorites</TabsTrigger>
          <TabsTrigger value="messages" data-testid="tab-messages">Messages</TabsTrigger>
          <TabsTrigger value="payments" data-testid="tab-payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Booking */}
          {activeBooking && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Stay</span>
                  <Badge className={getBookingStatusColor(activeBooking.status)}>
                    {activeBooking.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BookingCard 
                  booking={activeBooking}
                  onViewDetails={() => console.log('View details')}
                  onMessage={() => console.log('Message owner')}
                />
              </CardContent>
            </Card>
          )}

          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingBookings.slice(0, 2).map((booking: any) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onViewDetails={() => console.log('View details')}
                    onMessage={() => console.log('Message owner')}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/search">
                  <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2" data-testid="action-search">
                    <MapPin className="w-6 h-6" />
                    <span>Find Properties</span>
                  </Button>
                </Link>
                
                <Link href="/messages">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" data-testid="action-messages">
                    <MessageSquare className="w-6 h-6" />
                    <span>Messages</span>
                  </Button>
                </Link>
                
                <Link href="/profile">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" data-testid="action-profile">
                    <Plus className="w-6 h-6" />
                    <span>Update Profile</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <Loading text="Loading bookings..." />
              ) : bookings.length > 0 ? (
                <div className="space-y-4" data-testid="bookings-list">
                  {bookings.map((booking: any) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onViewDetails={() => console.log('View details')}
                      onMessage={() => console.log('Message owner')}
                      onCancel={() => console.log('Cancel booking')}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8" data-testid="no-bookings">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">Start exploring properties to make your first booking</p>
                  <Link href="/search">
                    <Button data-testid="start-searching">Start Searching</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8" data-testid="no-favorites">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-4">Save properties you like to easily find them later</p>
                <Link href="/search">
                  <Button data-testid="browse-properties">Browse Properties</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8" data-testid="no-messages">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No messages</h3>
                <p className="text-muted-foreground mb-4">Your conversations with property owners will appear here</p>
                <Link href="/messages">
                  <Button data-testid="view-all-messages">View All Messages</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8" data-testid="no-payments">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No payments yet</h3>
                <p className="text-muted-foreground">Your payment history will appear here after making bookings</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
