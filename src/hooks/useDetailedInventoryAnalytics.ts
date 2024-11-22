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
  return useQuery<DetailedInventoryAnalytics[]>({
    queryKey: ["detailed-inventory-analytics"],
    queryFn: async () => {
      console.log("Fetching detailed inventory analytics");
      const { data, error } = await supabase
        .from('inventory_items')
        .select(`
          *,
          inventory_types!inner (name),
          sectors!inner (
            name,
            zones!inner (name)
          ),
          bookings:bookings (count),
          confirmed_bookings:bookings!inner (count),
          order_count:order_items (count),
          total_revenue:order_items (sum)
        `)
        .eq('bookings.status', 'confirmed');

      if (error) {
        console.error("Error fetching detailed inventory analytics:", error);
        throw error;
      }

      return data.map(item => ({
        item_id: item.id,
        type_name: item.inventory_types?.name || 'Unknown',
        zone_name: item.sectors?.zones?.name || 'Unknown',
        sector_name: item.sectors?.name || 'Unknown',
        sku: item.sku,
        current_price: item.current_price,
        min_price: item.min_price,
        ltc: item.ltc,
        dimensions: item.dimensions,
        quantity: item.quantity,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        total_bookings: (item.bookings?.[0]?.count as number) || 0,
        confirmed_bookings: (item.confirmed_bookings?.[0]?.count as number) || 0,
        times_ordered: (item.order_count?.[0]?.count as number) || 0,
        total_revenue: (item.total_revenue?.[0]?.sum as number) || 0
      }));
    },
  });
};