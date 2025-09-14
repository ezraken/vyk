import { PROPERTY_TYPES, BUDGET_CLASSES, BOOKING_STATUSES, PAYMENT_STATUSES, USER_ROLES } from "./constants";

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `$${numPrice.toFixed(0)}`;
}

export function formatPriceDetailed(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `$${numPrice.toLocaleString()}`;
}

export function getPropertyTypeLabel(type: string): string {
  return PROPERTY_TYPES[type as keyof typeof PROPERTY_TYPES] || type;
}

export function getBudgetClassLabel(budgetClass: string): string {
  return BUDGET_CLASSES[budgetClass as keyof typeof BUDGET_CLASSES] || budgetClass;
}

export function getBookingStatusLabel(status: string): string {
  return BOOKING_STATUSES[status as keyof typeof BOOKING_STATUSES] || status;
}

export function getPaymentStatusLabel(status: string): string {
  return PAYMENT_STATUSES[status as keyof typeof PAYMENT_STATUSES] || status;
}

export function getUserRoleLabel(role: string): string {
  return USER_ROLES[role as keyof typeof USER_ROLES] || role;
}

export function getBudgetClassColor(budgetClass: string): string {
  switch (budgetClass) {
    case "low":
      return "bg-primary/10 text-primary";
    case "middle":
      return "bg-chart-3/10 text-chart-3";
    case "high":
      return "bg-chart-4/10 text-chart-4";
    default:
      return "bg-muted/10 text-muted-foreground";
  }
}

export function getBookingStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-accent/10 text-accent";
    case "confirmed":
      return "bg-chart-3/10 text-chart-3";
    case "cancelled":
      return "bg-destructive/10 text-destructive";
    case "completed":
      return "bg-chart-2/10 text-chart-2";
    default:
      return "bg-muted/10 text-muted-foreground";
  }
}

export function getPaymentStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-accent/10 text-accent";
    case "in_escrow":
      return "bg-chart-2/10 text-chart-2";
    case "released":
      return "bg-chart-3/10 text-chart-3";
    case "refunded":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted/10 text-muted-foreground";
  }
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

export function getUserInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function generateStarRating(rating: number): JSX.Element[] {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-accent fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-accent" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`half-${i}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#half-${i})`}
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      );
    } else {
      stars.push(
        <svg key={i} className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      );
    }
  }

  return stars;
}

export function calculateDaysStay(checkIn: string, checkOut: string): number {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function calculateMonthsStay(checkIn: string, checkOut: string): number {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  let months = (checkOutDate.getFullYear() - checkInDate.getFullYear()) * 12;
  months -= checkInDate.getMonth();
  months += checkOutDate.getMonth();
  
  return months <= 0 ? 1 : months;
}

export function validateDates(checkIn: string, checkOut: string): { valid: boolean; error?: string } {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    return { valid: false, error: "Check-in date cannot be in the past" };
  }

  if (checkOutDate <= checkInDate) {
    return { valid: false, error: "Check-out date must be after check-in date" };
  }

  return { valid: true };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
