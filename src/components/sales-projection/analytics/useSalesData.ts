import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRangeType } from "../filters/SalesFilters";
import { getDateRange } from "../utils/dateUtils";

export interface InventoryPerformanceType {
  name: string;
  totalSold: number;
  revenue: number;
  availableQuantity: number;
}

export interface SalesData {
  teamPerformance: {
    team: string;
    totalSales: number;
    totalRevenue: number;
  }[];
  inventoryPerformance: Record<string, InventoryPerformanceType>;
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

      // Get all inventory types first
      const { data: inventoryTypes, error: inventoryError } = await supabase
        .from('sales_projection_inventory')
        .select('*');

      if (inventoryError) {
        console.error("Error fetching inventory types:", inventoryError);
        throw inventoryError;
      }

      // Get sales entries with filters
      let query = supabase
        .from('sales_projection_entries')
        .select(`
          *,
          sales_projection_inventory (
            id,
            name,
            total_quantity,
            landing_cost,
            minimum_price
          )
        `);

      if (dateRangeValues) {
        query = query
          .gte('sale_date', dateRangeValues.start.toISOString())
          .lte('sale_date', dateRangeValues.end.toISOString());
      }

      // Filter by inventory type if specified
      if (selectedInventoryType !== 'all') {
        const selectedType = inventoryTypes?.find(type => type.name === selectedInventoryType);
        if (selectedType) {
          query = query.eq('inventory_id', selectedType.id);
        }
      }

      const { data: entries, error: entriesError } = await query;

      if (entriesError) {
        console.error("Error fetching entries:", entriesError);
        throw entriesError;
      }

      console.log("Fetched entries:", entries);
      console.log("Fetched inventory types:", inventoryTypes);

      // Calculate team performance based on filtered entries
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

      // Filter inventory types based on selection
      const relevantTypes = selectedInventoryType === 'all' 
        ? inventoryTypes 
        : inventoryTypes?.filter(type => type.name === selectedInventoryType) || [];

      // Calculate inventory performance for filtered types
      const inventoryPerformance = relevantTypes.reduce((acc: Record<string, InventoryPerformanceType>, type: any) => {
        const typeEntries = entries?.filter(entry => 
          entry.sales_projection_inventory?.id === type.id
        ) || [];

        const totalSold = typeEntries.reduce((sum, entry) => 
          sum + entry.quantity_sold, 0);

        acc[type.name] = {
          name: type.name,
          totalSold,
          revenue: typeEntries.reduce((sum, entry) => 
            sum + (entry.quantity_sold * entry.selling_price), 0),
          availableQuantity: type.total_quantity - totalSold
        };
        return acc;
      }, {});

      // Calculate totals based on filtered entries only
      const totalSold = (entries || []).reduce((sum: number, entry: any) => 
        sum + entry.quantity_sold, 0);

      const totalRevenue = (entries || []).reduce((sum: number, entry: any) => 
        sum + (entry.quantity_sold * entry.selling_price), 0);

      // Calculate total available inventory for filtered types
      const totalAvailableInventory = relevantTypes.reduce((sum: number, type: any) => {
        const typeSold = (entries || [])
          .filter(entry => entry.sales_projection_inventory?.id === type.id)
          .reduce((s, entry) => s + entry.quantity_sold, 0);
        return sum + (type.total_quantity - typeSold);
      }, 0);

      return {
        teamPerformance: Object.values(teamPerformance),
        inventoryPerformance,
        totalRevenue,
        totalSales: totalSold,
        totalAvailableInventory
      };
    },
  });
};