import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import PropertyDetails from "@/pages/PropertyDetails";
import SearchResults from "@/pages/SearchResults";
import Dashboard from "@/pages/Dashboard";
import Booking from "@/pages/Booking";
import ListProperty from "@/pages/ListProperty";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import About from "@/pages/About";
import Support from "@/pages/Support";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/property/:id" component={PropertyDetails} />
      <Route path="/search" component={SearchResults} />
      <Route path="/dashboard/:role?" component={Dashboard} />
      <Route path="/booking/:propertyId?" component={Booking} />
      <Route path="/list-property" component={ListProperty} />
      <Route path="/profile" component={Profile} />
      <Route path="/messages" component={Messages} />
      <Route path="/about" component={About} />
      <Route path="/support" component={Support} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
