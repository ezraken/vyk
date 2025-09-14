import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertPropertySchema, type InsertProperty } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { AMENITIES_LIST, PROPERTY_TYPES, BUDGET_CLASSES } from "@/utils/constants";
import { Home, MapPin, DollarSign, Image, Info, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function ListProperty() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const form = useForm<InsertProperty>({
    resolver: zodResolver(insertPropertySchema.omit({ ownerId: true })),
    defaultValues: {
      title: "",
      description: "",
      type: "shared_room",
      budgetClass: "middle",
      pricePerMonth: "0",
      securityDeposit: "0",
      address: "",
      city: "",
      country: "",
      bedrooms: 1,
      bathrooms: 1,
      capacity: 1,
      size: 0,
      amenities: [],
      images: [],
      minimumStay: 1,
      isAvailable: true,
    },
  });

  const createPropertyMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      const response = await apiRequest("POST", "/api/properties", {
        ...data,
        amenities: selectedAmenities,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Property Listed Successfully",
        description: "Your property has been submitted for review.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      setLocation(`/property/${data.property.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to List Property",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect if not authenticated or not an owner
  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  if (user?.role !== "owner" && user?.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8" data-testid="access-denied">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground mb-4">
              Only property owners can list properties. Please register as an owner to continue.
            </p>
            <Button onClick={() => setLocation("/")}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = (data: InsertProperty) => {
    createPropertyMutation.mutate(data);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setSelectedAmenities(prev => 
      checked 
        ? [...prev, amenity]
        : prev.filter(a => a !== amenity)
    );
  };

  return (
    <div className="container mx-auto px-4 py-8" data-testid="list-property-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="page-title">
          List Your Property
        </h1>
        <p className="text-muted-foreground" data-testid="page-subtitle">
          Share your property with students looking for quality accommodation
        </p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card data-testid="basic-info-section">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">
                  Property Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Cozy Student Room Near Campus"
                  {...form.register("title")}
                  data-testid="input-title"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive mt-1" data-testid="error-title">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="type" className="text-sm font-medium">
                  Property Type *
                </Label>
                <Select onValueChange={(value) => form.setValue("type", value as any)}>
                  <SelectTrigger data-testid="select-property-type">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROPERTY_TYPES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.type && (
                  <p className="text-sm text-destructive mt-1" data-testid="error-type">
                    {form.formState.errors.type.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your property, highlighting key features and nearby amenities..."
                className="min-h-[100px]"
                {...form.register("description")}
                data-testid="input-description"
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive mt-1" data-testid="error-description">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="budgetClass" className="text-sm font-medium">
                Budget Class *
              </Label>
              <Select onValueChange={(value) => form.setValue("budgetClass", value as any)}>
                <SelectTrigger data-testid="select-budget-class">
                  <SelectValue placeholder="Select budget class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Class ($50-150/month)</SelectItem>
                  <SelectItem value="middle">Middle Class ($150-400/month)</SelectItem>
                  <SelectItem value="high">High Class ($400+/month)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                This helps students find properties that match their budget
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card data-testid="location-section">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                Street Address *
              </Label>
              <Input
                id="address"
                placeholder="123 University Street"
                {...form.register("address")}
                data-testid="input-address"
              />
              {form.formState.errors.address && (
                <p className="text-sm text-destructive mt-1" data-testid="error-address">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city" className="text-sm font-medium">
                  City *
                </Label>
                <Input
                  id="city"
                  placeholder="Cape Town"
                  {...form.register("city")}
                  data-testid="input-city"
                />
                {form.formState.errors.city && (
                  <p className="text-sm text-destructive mt-1" data-testid="error-city">
                    {form.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="country" className="text-sm font-medium">
                  Country *
                </Label>
                <Input
                  id="country"
                  placeholder="South Africa"
                  {...form.register("country")}
                  data-testid="input-country"
                />
                {form.formState.errors.country && (
                  <p className="text-sm text-destructive mt-1" data-testid="error-country">
                    {form.formState.errors.country.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card data-testid="details-section">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="w-5 h-5 mr-2" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <Label htmlFor="bedrooms" className="text-sm font-medium">
                  Bedrooms *
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="1"
                  {...form.register("bedrooms", { valueAsNumber: true })}
                  data-testid="input-bedrooms"
                />
              </div>

              <div>
                <Label htmlFor="bathrooms" className="text-sm font-medium">
                  Bathrooms *
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="1"
                  {...form.register("bathrooms", { valueAsNumber: true })}
                  data-testid="input-bathrooms"
                />
              </div>

              <div>
                <Label htmlFor="capacity" className="text-sm font-medium">
                  Max Guests *
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  {...form.register("capacity", { valueAsNumber: true })}
                  data-testid="input-capacity"
                />
              </div>

              <div>
                <Label htmlFor="size" className="text-sm font-medium">
                  Size (sq ft)
                </Label>
                <Input
                  id="size"
                  type="number"
                  min="0"
                  {...form.register("size", { valueAsNumber: true })}
                  data-testid="input-size"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="minimumStay" className="text-sm font-medium">
                Minimum Stay (months) *
              </Label>
              <Input
                id="minimumStay"
                type="number"
                min="1"
                max="12"
                {...form.register("minimumStay", { valueAsNumber: true })}
                data-testid="input-minimum-stay"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Minimum number of months students must book
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card data-testid="pricing-section">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="pricePerMonth" className="text-sm font-medium">
                  Monthly Rent (USD) *
                </Label>
                <Input
                  id="pricePerMonth"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="250.00"
                  {...form.register("pricePerMonth")}
                  data-testid="input-price"
                />
                {form.formState.errors.pricePerMonth && (
                  <p className="text-sm text-destructive mt-1" data-testid="error-price">
                    {form.formState.errors.pricePerMonth.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="securityDeposit" className="text-sm font-medium">
                  Security Deposit (USD) *
                </Label>
                <Input
                  id="securityDeposit"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="125.00"
                  {...form.register("securityDeposit")}
                  data-testid="input-deposit"
                />
                {form.formState.errors.securityDeposit && (
                  <p className="text-sm text-destructive mt-1" data-testid="error-deposit">
                    {form.formState.errors.securityDeposit.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card data-testid="amenities-section">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Amenities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {AMENITIES_LIST.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    data-testid={`amenity-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label htmlFor={amenity} className="text-sm">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Images Section */}
        <Card data-testid="images-section">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="w-5 h-5 mr-2" />
              Property Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Image upload coming soon
              </h3>
              <p className="text-muted-foreground">
                You'll be able to upload property images in the next update. For now, your listing will use default images.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="bg-secondary rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Before you submit:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Double-check all information for accuracy</li>
                  <li>• Your property will be reviewed within 24-48 hours</li>
                  <li>• You'll be notified once your listing is approved</li>
                  <li>• Students can start booking once approved</li>
                </ul>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={createPropertyMutation.isPending}
                data-testid="submit-property"
              >
                {createPropertyMutation.isPending ? "Submitting..." : "List My Property"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
