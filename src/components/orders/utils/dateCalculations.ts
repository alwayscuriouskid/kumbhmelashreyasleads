import { addDays } from "date-fns";

export const calculateNextPaymentDate = (paymentDate: Date | undefined, creditPeriod: string): Date | undefined => {
  if (!paymentDate || !creditPeriod) return undefined;
  
  console.log('Calculating next payment date:', { paymentDate, creditPeriod });
  
  // Extract number of days from credit period string (e.g., "30days" -> 30)
  const days = parseInt(creditPeriod.replace('days', ''));
  
  if (isNaN(days)) {
    console.warn('Invalid credit period format:', creditPeriod);
    return undefined;
  }
  
  return addDays(paymentDate, days);
};