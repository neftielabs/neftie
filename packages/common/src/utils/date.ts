/**
 * Add days to a date
 */
export const addDays = (days: number, sourceDate = new Date()) => {
  const date = new Date(sourceDate);
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * Add seconds to a date
 */
export const addSeconds = (seconds: number, sourceDate = new Date()) => {
  const date = new Date(sourceDate);
  date.setDate(date.getSeconds() + seconds);
  return date;
};

/**
 * Check if a date is past
 */
export const isExpired = (date: Date) => new Date() > date;
