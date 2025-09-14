import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { PropertySearch } from "@/components/property/PropertySearch";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { Loading } from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { SlidersHorizontal } from "lucide-react";
import { PropertySearchForm } from "@shared/schema";
import { SearchFilters } from "@/types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function SearchResults() {
  const [location] = useLocation();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("rating");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Parse URL parameters for initial filters
  const urlParams = useMemo(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const filters: SearchFilters = {};
    
    if (params.get('location')) filters.location = params.get('location')!;
    if (params.get('checkIn')) filters.checkIn = params.get('checkIn')!;
    if (params.get('checkOut')) filters.checkOut = params.get('checkOut')!;
    if (params.get('budgetClass')) filters.budgetClass = params.get('budgetClass') as any;
    if (params.get('propertyType')) filters.propertyType = params.get('propertyType') as any;
    if (params.get('minPrice')) filters.minPrice = parseInt(params.get('minPrice')!);
    if (params.get('maxPrice')) filters.maxPrice = parseInt(params.get('maxPrice')!);

    return filters;
  }, [location]);

  const [filters, setFilters] = useState<SearchFilters>(urlParams);

  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/properties", { ...filters, page, sortBy }],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      Object.entries({ ...filters, page, sortBy }).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/properties?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      return response.json();
    },
  });

  const handleSearch = (newFilters: PropertySearchForm) => {
    setFilters(newFilters);
    setPage(1);
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString());
      }
    });
    window.history.replaceState(null, '', `/search?${params.toString()}`);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    const clearedFilters: SearchFilters = {
      location: filters.location, // Keep location
      checkIn: filters.checkIn, // Keep dates
      checkOut: filters.checkOut,
    };
    setFilters(clearedFilters);
    setPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const properties = searchResults?.properties || [];
  const totalPages = searchResults?.totalPages || 1;
  const total = searchResults?.total || 0;

  return (
    <div data-testid="page-search-results">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <PropertySearch onSearch={handleSearch} initialFilters={filters} />
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <PropertyFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground" data-testid="search-title">
                  {filters.location ? `Properties in ${filters.location}` : 'All Properties'}
                </h1>
                <p className="text-muted-foreground" data-testid="results-count">
                  {isLoading ? 'Searching...' : `${total} result${total !== 1 ? 's' : ''} found`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Mobile Filters Button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden" data-testid="mobile-filters-button">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <PropertyFilters
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onClearFilters={handleClearFilters}
                    />
                  </SheetContent>
                </Sheet>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48" data-testid="sort-select">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse" data-testid={`loading-card-${i}`}>
                    <div className="bg-muted rounded-t-lg h-64"></div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="bg-muted h-4 rounded w-3/4"></div>
                        <div className="bg-muted h-4 rounded w-1/2"></div>
                        <div className="bg-muted h-4 rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12" data-testid="search-error">
                <p className="text-muted-foreground mb-4">
                  Failed to load properties. Please try again.
                </p>
                <Button onClick={() => refetch()} variant="outline" data-testid="retry-button">
                  Try Again
                </Button>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && !error && properties.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8" data-testid="properties-grid">
                  {properties.map((property: any) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onFavoriteToggle={(id) => console.log('Toggle favorite:', id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2" data-testid="pagination">
                    <Button
                      variant="outline"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      data-testid="prev-page"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
                        onClick={() => setPage(pageNum)}
                        data-testid={`page-${pageNum}`}
                      >
                        {pageNum}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      data-testid="next-page"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* No Results */}
            {!isLoading && !error && properties.length === 0 && (
              <div className="text-center py-12" data-testid="no-results">
                <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or clear some filters
                </p>
                <Button onClick={handleClearFilters} variant="outline" data-testid="clear-filters">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
