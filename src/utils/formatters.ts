export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatIndianShortCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(1);
    return `₹${cr.endsWith('.0') ? cr.slice(0, -2) : cr} Cr`;
  }
  if (amount >= 100000) {
    const l = (amount / 100000).toFixed(1);
    return `₹${l.endsWith('.0') ? l.slice(0, -2) : l} L`;
  }
  if (amount >= 1000) {
    return `₹${Math.round(amount / 1000)}k`;
  }
  return `₹${amount}`;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return formatDate(dateString);
};

export const getInitials = (name: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

export const getScoreColor = (score: number): { text: string; bg: string; border: string } => {
  if (score >= 80) {
    return {
      text: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      border: 'border-emerald-200 dark:border-emerald-800/60',
    };
  }
  if (score >= 50) {
    return {
      text: 'text-amber-700 dark:text-amber-300',
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      border: 'border-amber-200 dark:border-amber-800/60',
    };
  }
  return {
    text: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-950/60',
    border: 'border-rose-200 dark:border-rose-800/60',
  };
};
