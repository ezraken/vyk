import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthModal } from "@/components/auth/AuthModal";
import { Menu, User, LogOut, Settings, MessageSquare, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    switch (user.role) {
      case "student":
        return "/dashboard/student";
      case "owner":
        return "/dashboard/owner";
      case "admin":
        return "/dashboard/admin";
      default:
        return "/dashboard";
    }
  };

  const navLinks = [
    { href: "/", label: "Home", active: location === "/" },
    { href: "/about", label: "About", active: location === "/about" },
    { href: "/search", label: "Search", active: location.startsWith("/search") },
    { href: "/support", label: "Support", active: location === "/support" },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-50" data-testid="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0" data-testid="logo-link">
                <h1 className="text-2xl font-bold text-primary">VYNESTO</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    link.active
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {user?.role === "owner" && (
                    <Link href="/list-property">
                      <Button variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-list-property">
                        List Property
                      </Button>
                    </Link>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="button-user-menu">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.profileImage || ""} alt={`${user?.firstName} ${user?.lastName}`} />
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                          <p className="w-[200px] truncate text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={getDashboardLink()} className="cursor-pointer" data-testid="menu-item-dashboard">
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/messages" className="cursor-pointer" data-testid="menu-item-messages">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Messages</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/bookings" className="cursor-pointer" data-testid="menu-item-bookings">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>My Bookings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer" data-testid="menu-item-profile">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer" data-testid="menu-item-logout">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setAuthModalOpen(true)}
                    className="text-muted-foreground hover:text-primary"
                    data-testid="button-sign-in"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-sign-up"
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    data-testid="button-list-property-guest"
                  >
                    List Property
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <div className="flex flex-col space-y-4 mt-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`text-lg transition-colors ${
                          link.active
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    
                    {isAuthenticated ? (
                      <>
                        <div className="border-t pt-4">
                          <div className="flex items-center space-x-3 mb-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user?.profileImage || ""} />
                              <AvatarFallback>{getUserInitials()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                              <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Link href={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                              <Button variant="ghost" className="w-full justify-start" data-testid="mobile-menu-dashboard">
                                <User className="mr-2 h-4 w-4" />
                                Dashboard
                              </Button>
                            </Link>
                            <Link href="/messages" onClick={() => setMobileMenuOpen(false)}>
                              <Button variant="ghost" className="w-full justify-start" data-testid="mobile-menu-messages">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Messages
                              </Button>
                            </Link>
                            <Link href="/bookings" onClick={() => setMobileMenuOpen(false)}>
                              <Button variant="ghost" className="w-full justify-start" data-testid="mobile-menu-bookings">
                                <Calendar className="mr-2 h-4 w-4" />
                                My Bookings
                              </Button>
                            </Link>
                            <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                              <Button variant="ghost" className="w-full justify-start" data-testid="mobile-menu-profile">
                                <Settings className="mr-2 h-4 w-4" />
                                Profile
                              </Button>
                            </Link>
                            {user?.role === "owner" && (
                              <Link href="/list-property" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start" data-testid="mobile-menu-list-property">
                                  List Property
                                </Button>
                              </Link>
                            )}
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => {
                                handleLogout();
                                setMobileMenuOpen(false);
                              }}
                              data-testid="mobile-menu-logout"
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Log out
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="border-t pt-4 space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => {
                            setAuthModalOpen(true);
                            setMobileMenuOpen(false);
                          }}
                          data-testid="mobile-menu-sign-in"
                        >
                          Sign In
                        </Button>
                        <Button
                          className="w-full"
                          onClick={() => {
                            setAuthModalOpen(true);
                            setMobileMenuOpen(false);
                          }}
                          data-testid="mobile-menu-sign-up"
                        >
                          Sign Up
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full bg-accent text-accent-foreground"
                          onClick={() => {
                            setAuthModalOpen(true);
                            setMobileMenuOpen(false);
                          }}
                          data-testid="mobile-menu-list-property-guest"
                        >
                          List Property
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
