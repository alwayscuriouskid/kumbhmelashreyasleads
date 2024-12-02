import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRangeType } from "../filters/SalesFilters";
import { getDateRange } from "../utils/dateUtils";

export interface SalesData {
  teamPerformance: {
    team: string;
    totalSales: number;
    totalRevenue: number;
  }[];
  inventoryPerformance: {
    name: string;
    totalSold: number;
    revenue: number;
    availableQuantity: number;
  }[];
  totalRevenue: number;
  totalSales: number;
  totalAvailableInventory: number;
}

export const useSalesData = (dateRange: DateRangeType, startDate?: Date, endDate?: Date, selectedInventoryType: string = 'all') => {
  return useQuery({
    queryKey: ['sales-analytics', dateRange, startDate, endDate, selectedInventoryType],
    queryFn: async () => {
      console.log("Fetching sales data with filters:", {
        dateRange,
        startDate,
        endDate,
        selectedInventoryType
      });

      const dateRangeValues = getDateRange(dateRange, startDate, endDate);

      // First get the inventory type details
      const { data: inventoryType } = await supabase
        .from('sales_projection_inventory')
        .select('*')
        .eq('name', selectedInventoryType)
        .single();

      // Get sales entries
      let query = supabase
        .from('sales_projection_entries')
        .select(`
          *,
          sales_projection_inventory (
            name,
            total_quantity
          )
        `);

      if (dateRangeValues) {
        query = query
          .gte('sale_date', dateRangeValues.start.toISOString())
          .lte('sale_date', dateRangeValues.end.toISOString());
      }

      if (selectedInventoryType !== 'all') {
        query = query.eq('sales_projection_inventory.name', selectedInventoryType);
      }

      const { data: entries } = await query;

      // Calculate metrics
      const teamPerformance = (entries || []).reduce((acc: any, entry: any) => {
        if (!acc[entry.team_location]) {
          acc[entry.team_location] = {
            team: entry.team_location,
            totalSales: 0,
            totalRevenue: 0,
          };
        }
        acc[entry.team_location].totalSales += entry.quantity_sold;
        acc[entry.team_location].totalRevenue += entry.quantity_sold * entry.selling_price;
        return acc;
      }, {});

      const inventoryPerformance = (entries || []).reduce((acc: any, entry: any) => {
        const name = entry.sales_projection_inventory?.name;
        if (!acc[name]) {
          acc[name] = {
            name,
            totalSold: 0,
            revenue: 0,
            availableQuantity: entry.sales_projection_inventory?.total_quantity || 0
          };
        }
        acc[name].totalSold += entry.quantity_sold;
        acc[name].revenue += entry.quantity_sold * entry.selling_price;
        acc[name].availableQuantity -= entry.quantity_sold;
        return acc;
      }, {});

      const totalSold = (entries || []).reduce((sum: number, entry: any) => 
        sum + entry.quantity_sold, 0);

      const totalRevenue = (entries || []).reduce((sum: number, entry: any) => 
        sum + (entry.quantity_sold * entry.selling_price), 0);

      let totalAvailableInventory = 0;
      if (selectedInventoryType === 'all') {
        const { data: allInventoryTypes } = await supabase
          .from('sales_projection_inventory')
          .select('total_quantity');
        totalAvailableInventory = (allInventoryTypes || []).reduce((sum: number, type: any) => 
          sum + (type.total_quantity || 0), 0) - totalSold;
      } else if (inventoryType) {
        totalAvailableInventory = inventoryType.total_quantity - totalSold;
      }

      return {
        teamPerformance: Object.values(teamPerformance),
        inventoryPerformance: Object.values(inventoryPerformance),
        totalRevenue,
        totalSales: totalSold,
        totalAvailableInventory
      };
    },
  });
};