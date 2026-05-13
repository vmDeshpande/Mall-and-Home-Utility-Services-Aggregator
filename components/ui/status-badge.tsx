import { cn } from '@/lib/utils';
import { Check, Clock, Zap } from 'lucide-react';

type Status = 'requested' | 'assigned' | 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'cancelled' | 'verified' | 'pending';

interface StatusBadgeProps {
  status: Status;
  className?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  const baseClasses = 'inline-flex items-center gap-1.5 font-medium rounded-full';

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const statusClasses = {
    requested: 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
    assigned: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200',
    accepted: 'bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
    rejected: 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200',
    'in-progress': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
    completed: 'bg-accent/10 text-accent dark:bg-accent/20',
    cancelled: 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200',
    verified: 'bg-accent/10 text-accent dark:bg-accent/20',
    pending: 'bg-muted text-muted-foreground',
  };

  const icons = {
    requested: Clock,
    assigned: Zap,
    accepted: Zap,
    rejected: Clock,
    'in-progress': Zap,
    completed: Check,
    cancelled: Clock,
    verified: Check,
    pending: Clock,
  };

  const Icon = icons[status];

  return (
    <span
      className={cn(
        baseClasses,
        sizeClasses[size],
        statusClasses[status],
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>
  );
}
