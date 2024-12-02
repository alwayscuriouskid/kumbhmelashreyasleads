import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { SalesFilters, DateRangeType } from "./filters/SalesFilters";
import { SalesCharts } from "./charts/SalesCharts";
import { SalesMetrics } from "./metrics/SalesMetrics";

interface InventoryPerformance {
  name: string;
  totalSold: number;
  revenue: number;
  availableQuantity: number;
}

export const SalesAnalytics = () => {
  const [dateRange, setDateRange] = useState<DateRangeType>("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedInventoryType, setSelectedInventoryType] = useState<string>("all");

  const { data: salesData } = useQuery({
    queryKey: ["sales-projection-analytics", dateRange, startDate, endDate, selectedInventoryType],
    queryFn: async () => {
      console.log("Fetching sales data with filters:", {
        dateRange,
        startDate,
        endDate,
        selectedInventoryType
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

      // Get current inventory status
      const { data: inventoryItems } = await supabase
        .from('inventory_items')
        .select('*');

      // Apply inventory type filter in memory
      let filteredEntries = entries.filter((entry: any) => {
        const meetsInventoryType = selectedInventoryType === "all" || 
          entry.sales_projection_inventory.name === selectedInventoryType;
        return meetsInventoryType;
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
            availableQuantity: 0
          };
        }
        acc[name].totalSold += entry.quantity_sold;
        acc[name].revenue += entry.quantity_sold * entry.selling_price;
        
        // Add available quantity from inventory items
        const inventoryItem = inventoryItems?.find((item: any) => 
          item.inventory_types?.name === name
        );
        if (inventoryItem) {
          acc[name].availableQuantity = inventoryItem.available_quantity;
        }
        
        return acc;
      }, {});

      return {
        teamPerformance: Object.values(teamPerformance),
        inventoryPerformance: Object.values(inventoryPerformance) as InventoryPerformance[],
        totalRevenue: filteredEntries.reduce(
          (sum: number, entry: any) =>
            sum + entry.quantity_sold * entry.selling_price,
          0
        ),
        totalSales: filteredEntries.reduce(
          (sum: number, entry: any) => sum + entry.quantity_sold,
          0
        ),
        totalAvailableInventory: inventoryItems?.reduce(
          (sum: number, item: any) => sum + (item.available_quantity || 0),
          0
        ) || 0
      };
    },
  });

  if (!salesData) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lead Analytics Dashboard</h1>
      </div>

      <div className="space-y-4">
        <SalesFilters
          dateRange={dateRange}
          setDateRange={setDateRange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          selectedInventoryType={selectedInventoryType}
          setSelectedInventoryType={setSelectedInventoryType}
          inventoryTypes={salesData.inventoryPerformance}
        />

        <SalesMetrics
          totalRevenue={salesData.totalRevenue}
          totalSales={salesData.totalSales}
          totalAvailableInventory={salesData.totalAvailableInventory}
        />

        <SalesCharts
          teamPerformance={salesData.teamPerformance}
          inventoryPerformance={salesData.inventoryPerformance}
        />
      </div>
    </div>
  );
};