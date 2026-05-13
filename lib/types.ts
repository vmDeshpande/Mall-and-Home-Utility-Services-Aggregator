export type ServiceCategory = 'plumbing' | 'electrical' | 'carpentry' | 'tailoring' | 'maintenance';

export interface Provider {
  id: string;
  _id?: string;
  userId?: string;
  phone?: string;
  email?: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  price: number;
  distance: number;
  verified: boolean;
  category: ServiceCategory;
  description: string;
  availability: string;
  completedJobs: number;
  services?: Service[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: ServiceCategory;
}

export interface Booking {
  id: string;
  providerId: string;
  serviceId: string;
  date: string;
  time: string;
  address: string;
  status: 'requested' | 'assigned' | 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
}

export interface Review {
  id: string;
  providerId: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
}

export interface Category {
  id: ServiceCategory;
  name: string;
  icon: string;
  description: string;
}
