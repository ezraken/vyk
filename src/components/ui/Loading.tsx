import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function Loading({ size = "md", text, className }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)} data-testid="loading">
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} data-testid="loading-spinner" />
      {text && (
        <p className="text-sm text-muted-foreground" data-testid="loading-text">
          {text}
        </p>
      )}
    </div>
  );
}

export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)} data-testid="loading-card">
      <div className="bg-muted rounded-lg h-64 mb-4"></div>
      <div className="space-y-3">
        <div className="bg-muted h-4 rounded w-3/4"></div>
        <div className="bg-muted h-4 rounded w-1/2"></div>
        <div className="bg-muted h-4 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" data-testid="loading-page">
      <Loading size="lg" text="Loading..." />
    </div>
  );
}
