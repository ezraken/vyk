export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SearchFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  budgetClass?: 'low' | 'middle' | 'high';
  propertyType?: 'shared_room' | 'private_room' | 'studio' | 'apartment' | 'homestay';
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
}

export interface PropertyWithReviews {
  id: string;
  title: string;
  description: string;
  type: string;
  budgetClass: string;
  pricePerMonth: string;
  images: string[];
  rating: string;
  reviewCount: number;
  city: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  reviews?: ReviewWithUser[];
}

export interface ReviewWithUser {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  student: {
    firstName: string;
    lastName: string;
  };
}

export interface BookingWithProperty {
  id: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  status: string;
  paymentPlan: string;
  property: {
    id: string;
    title: string;
    images: string[];
    city: string;
    country: string;
  };
}

export interface ChatWithMessages {
  id: string;
  property: {
    title: string;
    images: string[];
  };
  student: {
    firstName: string;
    lastName: string;
  };
  owner: {
    firstName: string;
    lastName: string;
  };
  lastMessage: string;
  lastMessageAt: string;
  messages: MessageWithSender[];
}

export interface MessageWithSender {
  id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
}
