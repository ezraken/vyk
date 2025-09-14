import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Filter, X } from "lucide-react";
import { SearchFilters } from "@/types";

interface PropertyFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

const amenitiesList = [
  "WiFi",
  "Air Conditioning",
  "Heating",
  "Kitchen",
  "Laundry",
  "Parking",
  "Security",
  "Study Area",
  "Common Area",
  "Gym",
  "Pool",
  "Garden",
  "Balcony",
  "Furnished",
  "Utilities Included",
];

const propertyTypes = [
  { value: "shared_room", label: "Shared Room" },
  { value: "private_room", label: "Private Room" },
  { value: "studio", label: "Studio" },
  { value: "apartment", label: "Apartment" },
  { value: "homestay", label: "Homestay" },
];

const budgetClasses = [
  { value: "low", label: "Low Class ($50-150)" },
  { value: "middle", label: "Middle Class ($150-400)" },
  { value: "high", label: "High Class ($400+)" },
];

export function PropertyFilters({ filters, onFiltersChange, onClearFilters }: PropertyFiltersProps) {
  const [priceRange, setPriceRange] = useState([
    filters.minPrice || 0,
    filters.maxPrice || 1000,
  ]);

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      propertyType: checked ? (type as any) : undefined,
    });
  };

  const handleBudgetClassChange = (budgetClass: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      budgetClass: checked ? (budgetClass as any) : undefined,
    });
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = checked
      ? [...currentAmenities, amenity]
      : currentAmenities.filter((a) => a !== amenity);

    onFiltersChange({
      ...filters,
      amenities: newAmenities,
    });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    onFiltersChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    });
  };

  const hasActiveFilters = 
    filters.propertyType ||
    filters.budgetClass ||
    (filters.amenities && filters.amenities.length > 0) ||
    filters.minPrice ||
    filters.maxPrice;

  return (
    <Card className="sticky top-24" data-testid="card-property-filters">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-clear-filters"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
              data-testid="slider-price-range"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span data-testid="text-min-price">${priceRange[0]}</span>
              <span data-testid="text-max-price">${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium" data-testid="button-toggle-property-type">
              Property Type
              <ChevronDown className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {propertyTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={type.value}
                  checked={filters.propertyType === type.value}
                  onCheckedChange={(checked) => handlePropertyTypeChange(type.value, checked as boolean)}
                  data-testid={`checkbox-property-type-${type.value}`}
                />
                <Label htmlFor={type.value} className="text-sm font-normal">
                  {type.label}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Budget Class */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium" data-testid="button-toggle-budget-class">
              Budget Class
              <ChevronDown className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {budgetClasses.map((budget) => (
              <div key={budget.value} className="flex items-center space-x-2">
                <Checkbox
                  id={budget.value}
                  checked={filters.budgetClass === budget.value}
                  onCheckedChange={(checked) => handleBudgetClassChange(budget.value, checked as boolean)}
                  data-testid={`checkbox-budget-class-${budget.value}`}
                />
                <Label htmlFor={budget.value} className="text-sm font-normal">
                  {budget.label}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Amenities */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium" data-testid="button-toggle-amenities">
              Amenities
              <ChevronDown className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3 max-h-48 overflow-y-auto">
            {amenitiesList.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities?.includes(amenity) || false}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                  data-testid={`checkbox-amenity-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                />
                <Label htmlFor={amenity} className="text-sm font-normal">
                  {amenity}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
