import { Link } from "wouter";
import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')",
      }}
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">VYNESTO</h3>
            <p className="text-gray-300 mb-6">
              Connecting students with safe, affordable accommodation across Africa and beyond.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
                data-testid="link-facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Twitter"
                data-testid="link-twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
                data-testid="link-instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors" data-testid="link-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors" data-testid="link-how-it-works">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors" data-testid="link-blog">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white transition-colors" data-testid="link-support">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors" data-testid="link-contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">For Students</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-gray-300 hover:text-white transition-colors" data-testid="link-search-properties">
                  Search Properties
                </Link>
              </li>
              <li>
                <Link href="/dashboard/student" className="text-gray-300 hover:text-white transition-colors" data-testid="link-student-dashboard">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/payment-plans" className="text-gray-300 hover:text-white transition-colors" data-testid="link-payment-plans">
                  Payment Plans
                </Link>
              </li>
              <li>
                <Link href="/safety-guide" className="text-gray-300 hover:text-white transition-colors" data-testid="link-safety-guide">
                  Safety Guide
                </Link>
              </li>
              <li>
                <Link href="/student-resources" className="text-gray-300 hover:text-white transition-colors" data-testid="link-student-resources">
                  Student Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">For Property Owners</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/list-property" className="text-gray-300 hover:text-white transition-colors" data-testid="link-list-property">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/dashboard/owner" className="text-gray-300 hover:text-white transition-colors" data-testid="link-owner-dashboard">
                  Owner Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pricing-guide" className="text-gray-300 hover:text-white transition-colors" data-testid="link-pricing-guide">
                  Pricing Guide
                </Link>
              </li>
              <li>
                <Link href="/property-management" className="text-gray-300 hover:text-white transition-colors" data-testid="link-property-management">
                  Property Management
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-gray-300 hover:text-white transition-colors" data-testid="link-success-stories">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm" data-testid="text-copyright">
              © 2024 VYNESTO. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors" data-testid="link-privacy">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors" data-testid="link-terms">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-300 hover:text-white text-sm transition-colors" data-testid="link-cookies">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
