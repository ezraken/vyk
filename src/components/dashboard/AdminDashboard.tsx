import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loading } from "@/components/ui/Loading";
import { 
  Users, 
  Home, 
  Calendar, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, formatDate, getUserRoleLabel, getBookingStatusColor } from "@/utils/helpers";

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: activeTab === "users",
  });

  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ["/api/admin/properties"],
    enabled: activeTab === "properties",
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/admin/bookings"],
    enabled: activeTab === "bookings",
  });

  const stats = statsData || {
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingProperties: 0,
    activeBookings: 0
  };

  const users = usersData?.users || [];
  const properties = propertiesData?.properties || [];
  const bookings = bookingsData?.bookings || [];

  const handleApproveProperty = async (propertyId: string) => {
    // TODO: Implement property approval API
    console.log('Approve property:', propertyId);
  };

  const handleRejectProperty = async (propertyId: string) => {
    // TODO: Implement property rejection API
    console.log('Reject property:', propertyId);
  };

  return (
    <div className="space-y-8" data-testid="admin-dashboard">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-chart-4 to-chart-4/80 text-white rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-2" data-testid="welcome-title">
          Admin Dashboard
        </h1>
        <p className="text-white/80" data-testid="welcome-subtitle">
          Monitor platform activity, manage users, and oversee operations.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-foreground" data-testid="stat-total-users">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
                <p className="text-3xl font-bold text-foreground" data-testid="stat-total-properties">
                  {stats.totalProperties}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Home className="w-6 h-6 text-accent" />
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
                  {stats.totalBookings}
                </p>
              </div>
              <div className="w-12 h-12 bg-chart-3/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Platform Revenue</p>
                <p className="text-3xl font-bold text-foreground" data-testid="stat-total-revenue">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-chart-2/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-accent" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                <span className="text-sm font-medium">Properties awaiting approval</span>
                <Badge className="bg-accent/10 text-accent" data-testid="pending-properties-count">
                  {stats.pendingProperties}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">User verifications</span>
                <Badge variant="secondary">0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-chart-3" />
              Platform Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-chart-3/5 rounded-lg">
                <span className="text-sm font-medium">Active bookings</span>
                <Badge className="bg-chart-3/10 text-chart-3" data-testid="active-bookings-count">
                  {stats.activeBookings}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">This month's revenue</span>
                <Badge variant="secondary">{formatPrice(0)}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
          <TabsTrigger value="properties" data-testid="tab-properties">Properties</TabsTrigger>
          <TabsTrigger value="bookings" data-testid="tab-bookings">Bookings</TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" data-testid="recent-activity">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-chart-3/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-chart-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New property approved</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New user registration</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Booking completed</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" data-testid="system-health">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database Status</span>
                    <Badge className="bg-chart-3/10 text-chart-3">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Payment Gateway</span>
                    <Badge className="bg-chart-3/10 text-chart-3">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Storage Service</span>
                    <Badge className="bg-chart-3/10 text-chart-3">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <Loading text="Loading users..." />
              ) : users.length > 0 ? (
                <Table data-testid="users-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {getUserRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={user.isVerified ? "bg-chart-3/10 text-chart-3" : "bg-accent/10 text-accent"}>
                            {user.isVerified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" data-testid={`view-user-${user.id}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8" data-testid="no-users">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
                  <p className="text-muted-foreground">User data will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Property Management</CardTitle>
            </CardHeader>
            <CardContent>
              {propertiesLoading ? (
                <Loading text="Loading properties..." />
              ) : properties.length > 0 ? (
                <Table data-testid="properties-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property: any) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">
                          {property.title}
                        </TableCell>
                        <TableCell>{property.owner?.firstName} {property.owner?.lastName}</TableCell>
                        <TableCell>{property.city}, {property.country}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              property.status === "approved" 
                                ? "bg-chart-3/10 text-chart-3"
                                : property.status === "pending_approval"
                                ? "bg-accent/10 text-accent" 
                                : "bg-destructive/10 text-destructive"
                            }
                          >
                            {property.status?.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatPrice(property.pricePerMonth)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {property.status === "pending_approval" && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleApproveProperty(property.id)}
                                  data-testid={`approve-property-${property.id}`}
                                >
                                  <CheckCircle className="w-4 h-4 text-chart-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRejectProperty(property.id)}
                                  data-testid={`reject-property-${property.id}`}
                                >
                                  <XCircle className="w-4 h-4 text-destructive" />
                                </Button>
                              </>
                            )}
                            <Button variant="ghost" size="sm" data-testid={`view-property-${property.id}`}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8" data-testid="no-properties">
                  <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
                  <p className="text-muted-foreground">Property listings will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Management</CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <Loading text="Loading bookings..." />
              ) : bookings.length > 0 ? (
                <Table data-testid="bookings-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking: any) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {booking.property?.title || 'Unknown Property'}
                        </TableCell>
                        <TableCell>
                          {booking.student?.firstName} {booking.student?.lastName}
                        </TableCell>
                        <TableCell>
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getBookingStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatPrice(booking.totalAmount)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" data-testid={`view-booking-${booking.id}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8" data-testid="no-bookings">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No bookings found</h3>
                  <p className="text-muted-foreground">Booking data will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8" data-testid="analytics-placeholder">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Coming Soon</h3>
                  <p className="text-muted-foreground">Detailed platform analytics and insights will be available here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
