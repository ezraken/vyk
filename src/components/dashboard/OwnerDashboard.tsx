import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyCard } from "@/components/property/PropertyCard";
import { BookingCard } from "@/components/booking/BookingCard";
import { Loading } from "@/components/ui/Loading";
import { 
  Home, 
  Plus, 
  DollarSign, 
  Calendar, 
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  Eye
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/utils/helpers";

export function OwnerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ["/api/owner/properties"],
    enabled: false, // TODO: Implement owner properties API
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/owner/bookings"],
    enabled: false, // TODO: Implement owner bookings API
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["/api/owner/analytics"],
    enabled: false, // TODO: Implement analytics API
  });

  const properties = propertiesData?.properties || [];
  const bookings = bookingsData?.bookings || [];
  const analytics = analyticsData?.analytics || {
    totalRevenue: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    avgRating: 0
  };

  return (
    <div className="space-y-8" data-testid="owner-dashboard">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-2" data-testid="welcome-title">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-accent-foreground/80" data-testid="welcome-subtitle">
          Manage your properties, bookings, and grow your rental business.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
                <p className="text-3xl font-bold text-foreground" data-testid="stat-total-properties">
                  {properties.length}
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
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-3xl font-bold text-foreground" data-testid="stat-monthly-revenue">
                  {formatPrice(analytics.monthlyRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-chart-3/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Bookings</p>
                <p className="text-3xl font-bold text-foreground" data-testid="stat-active-bookings">
                  {bookings.filter((b: any) => b.status === "confirmed").length}
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
                <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
                <p className="text-3xl font-bold text-foreground" data-testid="stat-avg-rating">
                  {analytics.avgRating.toFixed(1)}
                </p>
              </div>
              <div className="w-12 h-12 bg-chart-2/10 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="properties" data-testid="tab-properties">Properties</TabsTrigger>
          <TabsTrigger value="bookings" data-testid="tab-bookings">Bookings</TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
          <TabsTrigger value="messages" data-testid="tab-messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-chart-3" />
                  <span className="text-2xl font-bold text-chart-3" data-testid="revenue-trend">
                    {formatPrice(analytics.totalRevenue)}
                  </span>
                  <span className="text-sm text-muted-foreground">total earned</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Revenue analytics will be displayed here
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-primary" data-testid="occupancy-rate">
                    {analytics.occupancyRate}%
                  </span>
                  <span className="text-sm text-muted-foreground">occupancy rate</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Performance metrics will be displayed here
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/list-property">
                  <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2" data-testid="action-list-property">
                    <Plus className="w-6 h-6" />
                    <span>List Property</span>
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" data-testid="action-view-bookings">
                  <Eye className="w-6 h-6" />
                  <span>View Bookings</span>
                </Button>
                
                <Link href="/messages">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" data-testid="action-messages">
                    <MessageSquare className="w-6 h-6" />
                    <span>Messages</span>
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2" data-testid="action-analytics">
                  <TrendingUp className="w-6 h-6" />
                  <span>Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length > 0 ? (
                <div className="space-y-4" data-testid="recent-bookings">
                  {bookings.slice(0, 3).map((booking: any) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onViewDetails={() => console.log('View details')}
                      onMessage={() => console.log('Message guest')}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8" data-testid="no-recent-bookings">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No recent bookings</h3>
                  <p className="text-muted-foreground">Bookings for your properties will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Properties</CardTitle>
                <Link href="/list-property">
                  <Button data-testid="add-property">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {propertiesLoading ? (
                <Loading text="Loading properties..." />
              ) : properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="properties-grid">
                  {properties.map((property: any) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8" data-testid="no-properties">
                  <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No properties listed</h3>
                  <p className="text-muted-foreground mb-4">Start earning by listing your first property</p>
                  <Link href="/list-property">
                    <Button data-testid="list-first-property">List Your First Property</Button>
                  </Link>
                </div>
              )}
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
                <div className="space-y-4" data-testid="all-bookings">
                  {bookings.map((booking: any) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onViewDetails={() => console.log('View details')}
                      onMessage={() => console.log('Message guest')}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8" data-testid="no-bookings">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground">Bookings for your properties will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8" data-testid="analytics-placeholder">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Coming Soon</h3>
                  <p className="text-muted-foreground">Detailed revenue and performance analytics will be available here</p>
                </div>
              </CardContent>
            </Card>
          </div>
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
                <p className="text-muted-foreground mb-4">Your conversations with guests will appear here</p>
                <Link href="/messages">
                  <Button data-testid="view-all-messages">View All Messages</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
