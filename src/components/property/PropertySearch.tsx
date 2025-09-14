import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySearchSchema, type PropertySearchForm } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Calendar, DollarSign } from "lucide-react";

interface PropertySearchProps {
  onSearch: (filters: PropertySearchForm) => void;
  initialFilters?: Partial<PropertySearchForm>;
  className?: string;
}

export function PropertySearch({ onSearch, initialFilters, className }: PropertySearchProps) {
  const form = useForm<PropertySearchForm>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: {
      location: initialFilters?.location || "",
      checkIn: initialFilters?.checkIn || "",
      checkOut: initialFilters?.checkOut || "",
      budgetClass: initialFilters?.budgetClass,
      propertyType: initialFilters?.propertyType,
      minPrice: initialFilters?.minPrice,
      maxPrice: initialFilters?.maxPrice,
    },
  });

  const onSubmit = (data: PropertySearchForm) => {
    onSearch(data);
  };

  return (
    <Card className={className} data-testid="card-property-search">
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-foreground flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Location
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="Where are you studying?"
                {...form.register("location")}
                className="w-full"
                data-testid="input-location"
              />
            </div>

            {/* Check-in */}
            <div className="space-y-2">
              <Label htmlFor="checkIn" className="text-sm font-medium text-foreground flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Check-in
              </Label>
              <Input
                id="checkIn"
                type="date"
                {...form.register("checkIn")}
                className="w-full"
                data-testid="input-check-in"
              />
            </div>

            {/* Check-out */}
            <div className="space-y-2">
              <Label htmlFor="checkOut" className="text-sm font-medium text-foreground flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Check-out
              </Label>
              <Input
                id="checkOut"
                type="date"
                {...form.register("checkOut")}
                className="w-full"
                data-testid="input-check-out"
              />
            </div>

            {/* Budget Class */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Budget Class
              </Label>
              <Select onValueChange={(value) => form.setValue("budgetClass", value as any)}>
                <SelectTrigger data-testid="select-budget-class">
                  <SelectValue placeholder="Any Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Budget</SelectItem>
                  <SelectItem value="low">Low ($50-150/month)</SelectItem>
                  <SelectItem value="middle">Middle ($150-400/month)</SelectItem>
                  <SelectItem value="high">High ($400+/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Property Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Property Type</Label>
              <Select onValueChange={(value) => form.setValue("propertyType", value as any)}>
                <SelectTrigger data-testid="select-property-type">
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Type</SelectItem>
                  <SelectItem value="shared_room">Shared Room</SelectItem>
                  <SelectItem value="private_room">Private Room</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="homestay">Homestay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Min Price */}
            <div className="space-y-2">
              <Label htmlFor="minPrice" className="text-sm font-medium text-foreground">Min Price</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="Min price"
                {...form.register("minPrice", { valueAsNumber: true })}
                data-testid="input-min-price"
              />
            </div>

            {/* Max Price */}
            <div className="space-y-2">
              <Label htmlFor="maxPrice" className="text-sm font-medium text-foreground">Max Price</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="Max price"
                {...form.register("maxPrice", { valueAsNumber: true })}
                data-testid="input-max-price"
              />
            </div>
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            data-testid="button-search-properties"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Properties
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
