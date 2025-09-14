export const PROPERTY_TYPES = {
  shared_room: "Shared Room",
  private_room: "Private Room", 
  studio: "Studio",
  apartment: "Apartment",
  homestay: "Homestay"
} as const;

export const BUDGET_CLASSES = {
  low: "Low Class",
  middle: "Middle Class",
  high: "High Class"
} as const;

export const BOOKING_STATUSES = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed"
} as const;

export const PAYMENT_STATUSES = {
  pending: "Pending",
  in_escrow: "In Escrow",
  released: "Released",
  refunded: "Refunded"
} as const;

export const USER_ROLES = {
  student: "Student",
  owner: "Property Owner",
  admin: "Administrator"
} as const;

export const AMENITIES_LIST = [
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
] as const;

export const PAYMENT_PLANS = {
  full: "Full Payment (5% discount)",
  monthly: "Monthly Payments",
  semester: "Semester Payments",
  student_loan: "Student Loan Assistance"
} as const;

export const DEFAULT_PROPERTY_IMAGES = {
  shared_room: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  private_room: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  studio: "https://images.unsplash.com/photo-1555636222-cae831e670b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  apartment: "https://images.unsplash.com/photo-1555636222-cae831e670b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  homestay: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
} as const;
