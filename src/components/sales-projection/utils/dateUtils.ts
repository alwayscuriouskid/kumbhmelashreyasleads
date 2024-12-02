export const getDateRange = (timeRange: string, startDate?: Date, endDate?: Date) => {
  const now = new Date();
  
  switch (timeRange) {
    case "today":
      return {
        start: new Date(now.setHours(0, 0, 0, 0)),
        end: new Date(now.setHours(23, 59, 59, 999))
      };
    case "week":
      const lastWeek = new Date(now);
      lastWeek.setDate(lastWeek.getDate() - 7);
      return {
        start: lastWeek,
        end: now
      };
    case "month":
      const lastMonth = new Date(now);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return {
        start: lastMonth,
        end: now
      };
    case "custom":
      if (startDate && endDate) {
        return {
          start: startDate,
          end: endDate
        };
      }
      return null;
    default:
      return null;
  }
};