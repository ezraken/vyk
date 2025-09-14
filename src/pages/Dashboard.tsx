import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { OwnerDashboard } from "@/components/dashboard/OwnerDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { Loading, LoadingPage } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorBoundary";
import { useEffect } from "react";

export default function Dashboard() {
  const { role } = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // Redirect to correct dashboard based on user role
  useEffect(() => {
    if (user && !role) {
      setLocation(`/dashboard/${user.role}`);
    } else if (user && role && role !== user.role && user.role !== "admin") {
      // Only redirect if user is not admin (admin can view any dashboard)
      setLocation(`/dashboard/${user.role}`);
    }
  }, [user, role, setLocation]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated || !user) {
    return <LoadingPage />;
  }

  // Determine which dashboard to show
  const dashboardRole = role || user.role;

  // Admin can access any dashboard, others can only access their own
  if (user.role !== "admin" && dashboardRole !== user.role) {
    return (
      <div className="container mx-auto px-4 py-8" data-testid="unauthorized-dashboard">
        <ErrorMessage
          title="Access Denied"
          message="You don't have permission to access this dashboard."
        />
      </div>
    );
  }

  const renderDashboard = () => {
    switch (dashboardRole) {
      case "student":
        return <StudentDashboard />;
      case "owner":
        return <OwnerDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return (
          <ErrorMessage
            title="Dashboard Not Found"
            message="The requested dashboard doesn't exist."
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" data-testid="dashboard-page">
      {renderDashboard()}
    </div>
  );
}
