export const addDays = (days: number, sourceDate = new Date()) => {
  const date = new Date(sourceDate);
  date.setDate(date.getDate() + days);
  return date;
};
