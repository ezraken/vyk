import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { formatDate, getUserInitials } from "@/utils/helpers";
import { Review } from "@shared/schema";

interface ReviewWithStudent extends Review {
  student?: {
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

interface ReviewCardProps {
  review: ReviewWithStudent;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const student = review.student;
  const studentName = student ? `${student.firstName} ${student.lastName}` : "Anonymous";
  const studentInitials = student ? getUserInitials(student.firstName, student.lastName) : "AN";

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-accent fill-current" : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <Card data-testid={`review-card-${review.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-10 h-10" data-testid="reviewer-avatar">
            <AvatarImage src={student?.profileImage} alt={studentName} />
            <AvatarFallback>{studentInitials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-card-foreground" data-testid="reviewer-name">
                  {studentName}
                </h4>
                <span className="text-sm text-muted-foreground" data-testid="review-date">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex" data-testid={`review-rating-${review.id}`}>
                  {renderStars(review.rating)}
                </div>
                <Badge variant="secondary" className="text-xs" data-testid="review-rating-badge">
                  {review.rating}/5
                </Badge>
              </div>
            </div>

            {review.comment && (
              <p className="text-muted-foreground leading-relaxed" data-testid="review-comment">
                {review.comment}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
