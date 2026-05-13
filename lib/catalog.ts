import type { Category, Service } from './types';

export const categories: Category[] = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: 'Droplets',
    description: 'Water and pipe repairs',
  },
  {
    id: 'electrical',
    name: 'Electrician',
    icon: 'Zap',
    description: 'Wiring and repairs',
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    icon: 'Hammer',
    description: 'Wood work',
  },
  {
    id: 'tailoring',
    name: 'Tailor',
    icon: 'Scissors',
    description: 'Stitching and alteration',
  },
  {
    id: 'maintenance',
    name: 'Maintenance Staff',
    icon: 'Wrench',
    description: 'Mall and facility tasks',
  },
];

export const fallbackServices: Service[] = [
  {
    id: 'plumbing',
    name: 'Plumbing Service',
    description: 'General plumbing repair and maintenance',
    price: 0,
    duration: 'Provider confirmed',
    category: 'plumbing',
  },
  {
    id: 'electrical',
    name: 'Electrical Service',
    description: 'General electrical repair and maintenance',
    price: 0,
    duration: 'Provider confirmed',
    category: 'electrical',
  },
  {
    id: 'carpentry',
    name: 'Carpentry Service',
    description: 'Furniture and fixture repair work',
    price: 0,
    duration: 'Provider confirmed',
    category: 'carpentry',
  },
  {
    id: 'tailoring',
    name: 'Stitching and Alteration',
    description: 'Tailoring, fitting, and alteration work',
    price: 0,
    duration: 'Provider confirmed',
    category: 'tailoring',
  },
  {
    id: 'maintenance',
    name: 'Maintenance Service',
    description: 'General facility and home maintenance',
    price: 0,
    duration: 'Provider confirmed',
    category: 'maintenance',
  },
];
