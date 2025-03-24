import { format } from 'date-fns';

export const formatNumber = (num: number) => {
  if (isNaN(num)) return '0';
  
  // For numbers less than 1000, show as is
  if (num < 1000) {
    return num.toString();
  }

  // For numbers >= 1000, use compact notation with more precision
  const tiers = [
    { threshold: 1e12, suffix: 'T' }, // Trillion
    { threshold: 1e9, suffix: 'B' },  // Billion
    { threshold: 1e6, suffix: 'M' },  // Million
    { threshold: 1e3, suffix: 'K' }   // Thousand
  ];

  for (const { threshold, suffix } of tiers) {
    if (num >= threshold) {
      const normalized = num / threshold;
      // Use 2 decimal places for millions and above, 1 for thousands
      const decimals = threshold >= 1e6 ? 2 : 1;
      return `${normalized.toFixed(decimals)}${suffix}`;
    }
  }

  return num.toString();
};

export const formatPercentage = (num: number) => {
  if (isNaN(num)) return '0.00%';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num) + '%';
};

export const formatLargeNumber = (num: number) => {
  if (isNaN(num)) return '0';
  
  // For numbers less than 1000, show as is
  if (num < 1000) {
    return num.toString();
  }

  // For very large numbers, use standard notation with suffix
  const tiers = [
    { threshold: 1e12, suffix: ' Trillion' },
    { threshold: 1e9, suffix: ' Billion' },
    { threshold: 1e6, suffix: ' Million' },
    { threshold: 1e3, suffix: ' Thousand' }
  ];

  for (const { threshold, suffix } of tiers) {
    if (num >= threshold) {
      const normalized = num / threshold;
      // Use more decimals for more precise representation
      return `${normalized.toFixed(2)}${suffix}`;
    }
  }

  return num.toLocaleString();
};

export const formatDate = (date: Date | string) => {
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatCompactNumber = (num: number) => {
  if (isNaN(num)) return '0';
  
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(num);
};