import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ms from 'ms';
import { League } from '@prisma/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return 'never';
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? '' : ' ago'
  }`;
};

export const pointsMultipler: Record<League['division'], number> = {
  '1': 3,
  '2': 2,
  '3': 1,
};
