import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().max(500, "Comment must be less than 500 characters").optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  propertyId: string;
  bookingId?: string;
  onSuccess?: () => void;
}

export function ReviewForm({ propertyId, bookingId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      const response = await apiRequest("POST", `/api/properties/${propertyId}/reviews`, {
        ...data,
        bookingId,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      form.reset();
      setRating(0);
      queryClient.invalidateQueries({ queryKey: ["/api/properties", propertyId, "reviews"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    createReviewMutation.mutate({ ...data, rating });
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
    form.setValue("rating", starRating);
  };

  return (
    <Card data-testid="review-form">
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Rating *
            </label>
            <div className="flex items-center space-x-1" data-testid="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleStarClick(star)}
                  data-testid={`star-${star}`}
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-colors",
                      (hoveredRating >= star || rating >= star)
                        ? "text-accent fill-current"
                        : "text-muted-foreground hover:text-accent"
                    )}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground" data-testid="rating-text">
                  {rating} star{rating !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            {form.formState.errors.rating && (
              <p className="text-sm text-destructive mt-1" data-testid="rating-error">
                {form.formState.errors.rating.message}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Comment (optional)
            </label>
            <Textarea
              placeholder="Share your experience with this property..."
              className="min-h-[100px]"
              {...form.register("comment")}
              data-testid="review-comment"
            />
            {form.formState.errors.comment && (
              <p className="text-sm text-destructive mt-1" data-testid="comment-error">
                {form.formState.errors.comment.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={createReviewMutation.isPending || rating === 0}
            className="w-full"
            data-testid="submit-review"
          >
            {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
