import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { SalesFilters, DateRangeType } from "./filters/SalesFilters";
import { SalesCharts } from "./charts/SalesCharts";
import { SalesMetrics } from "./metrics/SalesMetrics";

export const SalesAnalytics = () => {
  const [dateRange, setDateRange] = useState<DateRangeType>("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [minRevenue, setMinRevenue] = useState<string>("");
  const [maxRevenue, setMaxRevenue] = useState<string>("");
  const [selectedInventoryType, setSelectedInventoryType] = useState<string>("all");
  const [minSales, setMinSales] = useState<string>("");
  const [maxSales, setMaxSales] = useState<string>("");

  const { data: salesData } = useQuery({
    queryKey: ["sales-projection-analytics", dateRange, startDate, endDate, minRevenue, maxRevenue, selectedInventoryType, minSales, maxSales],
    queryFn: async () => {
      console.log("Fetching sales data with filters:", {
        dateRange,
        startDate,
        endDate,
        minRevenue,
        maxRevenue,
        selectedInventoryType,
        minSales,
        maxSales
      });

      let query = supabase
        .from("sales_projection_entries")
        .select(`
          *,
          sales_projection_inventory (
            name,
            landing_cost,
            minimum_price
          )
        `);

      // Apply date filters
      if (dateRange !== "all") {
        const now = new Date();
        let start = now;
        let end = now;

        switch (dateRange) {
          case "today":
            start = new Date(now.setHours(0, 0, 0, 0));
            end = new Date(now.setHours(23, 59, 59, 999));
            break;
          case "week":
            start = new Date(now.setDate(now.getDate() - 7));
            break;
          case "month":
            start = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case "custom":
            if (startDate) query = query.gte("sale_date", startDate.toISOString());
            if (endDate) query = query.lte("sale_date", endDate.toISOString());
            break;
        }

        if (dateRange !== "custom") {
          query = query.gte("sale_date", start.toISOString());
          query = query.lte("sale_date", end.toISOString());
        }
      }

      const { data: entries, error } = await query;

      if (error) throw error;

      // Apply revenue and sales filters in memory
      let filteredEntries = entries.filter((entry: any) => {
        const revenue = entry.quantity_sold * entry.selling_price;
        const meetsMinRevenue = !minRevenue || revenue >= parseFloat(minRevenue);
        const meetsMaxRevenue = !maxRevenue || revenue <= parseFloat(maxRevenue);
        const meetsMinSales = !minSales || entry.quantity_sold >= parseFloat(minSales);
        const meetsMaxSales = !maxSales || entry.quantity_sold <= parseFloat(maxSales);
        const meetsInventoryType = selectedInventoryType === "all" || entry.sales_projection_inventory.name === selectedInventoryType;

        return meetsMinRevenue && meetsMaxRevenue && meetsMinSales && meetsMaxSales && meetsInventoryType;
      });

      // Calculate analytics
      const teamPerformance = filteredEntries.reduce((acc: any, entry: any) => {
        if (!acc[entry.team_location]) {
          acc[entry.team_location] = {
            team: entry.team_location,
            totalSales: 0,
            totalRevenue: 0,
          };
        }
        acc[entry.team_location].totalSales += entry.quantity_sold;
        acc[entry.team_location].totalRevenue +=
          entry.quantity_sold * entry.selling_price;
        return acc;
      }, {});

      const inventoryPerformance = filteredEntries.reduce((acc: any, entry: any) => {
        const name = entry.sales_projection_inventory.name;
        if (!acc[name]) {
          acc[name] = {
            name,
            totalSold: 0,
            revenue: 0,
          };
        }
        acc[name].totalSold += entry.quantity_sold;
        acc[name].revenue += entry.quantity_sold * entry.selling_price;
        return acc;
      }, {});

      return {
        teamPerformance: Object.values(teamPerformance),
        inventoryPerformance: Object.values(inventoryPerformance),
        totalRevenue: filteredEntries.reduce(
          (sum: number, entry: any) =>
            sum + entry.quantity_sold * entry.selling_price,
          0
        ),
        totalSales: filteredEntries.reduce(
          (sum: number, entry: any) => sum + entry.quantity_sold,
          0
        ),
      };
    },
  });

  if (!salesData) return null;

  return (
    <div className="space-y-6">
      <SalesFilters
        dateRange={dateRange}
        setDateRange={setDateRange}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        minRevenue={minRevenue}
        setMinRevenue={setMinRevenue}
        maxRevenue={maxRevenue}
        setMaxRevenue={setMaxRevenue}
        selectedInventoryType={selectedInventoryType}
        setSelectedInventoryType={setSelectedInventoryType}
        minSales={minSales}
        setMinSales={setMinSales}
        maxSales={maxSales}
        setMaxSales={setMaxSales}
        inventoryTypes={salesData.inventoryPerformance}
      />

      <SalesMetrics
        totalRevenue={salesData.totalRevenue}
        totalSales={salesData.totalSales}
      />

      <SalesCharts
        teamPerformance={salesData.teamPerformance}
        inventoryPerformance={salesData.inventoryPerformance}
      />
    </div>
  );
};