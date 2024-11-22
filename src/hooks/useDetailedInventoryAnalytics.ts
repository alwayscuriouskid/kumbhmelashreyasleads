import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DetailedInventoryAnalytics {
  item_id: string;
  type_name: string;
  zone_name: string;
  sector_name: string;
  sku: string | null;
  current_price: number;
  min_price: number;
  ltc: number | null;
  dimensions: string | null;
  quantity: number;
  status: string;
  created_at: string;
  updated_at: string;
  total_bookings: number;
  confirmed_bookings: number;
  times_ordered: number;
  total_revenue: number;
}

export const useDetailedInventoryAnalytics = () => {
  return useQuery({
    queryKey: ["detailed-inventory-analytics"],
    queryFn: async () => {
      console.log("Fetching detailed inventory analytics");
      const { data, error } = await supabase
        .from("detailed_inventory_analytics")
        .select("*");

      if (error) {
        console.error("Error fetching detailed inventory analytics:", error);
        throw error;
      }

      return data as DetailedInventoryAnalytics[];
    },
  });
};