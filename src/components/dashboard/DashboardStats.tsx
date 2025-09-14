import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("", className)} data-testid={`stats-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground" data-testid="stats-title">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground" data-testid="stats-value">
              {value}
            </p>
            {trend && (
              <p className={cn(
                "text-sm mt-1",
                trend.value > 0 ? "text-chart-3" : trend.value < 0 ? "text-destructive" : "text-muted-foreground"
              )} data-testid="stats-trend">
                {trend.value > 0 ? "+" : ""}{trend.value}% {trend.label}
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  stats: Array<{
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
      value: number;
      label: string;
    };
  }>;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="dashboard-stats">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}
