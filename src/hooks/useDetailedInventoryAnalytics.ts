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
        .from('inventory_items')
        .select(`
          id as item_id,
          inventory_types!inner(name as type_name),
          sectors!inner(
            name as sector_name,
            zones!inner(name as zone_name)
          ),
          sku,
          current_price,
          min_price,
          ltc,
          dimensions,
          quantity,
          status,
          created_at,
          updated_at,
          bookings(count),
          bookings(count).filter(status.eq.confirmed),
          order_items(count),
          order_items(sum(price))
        `);

      if (error) {
        console.error("Error fetching detailed inventory analytics:", error);
        throw error;
      }

      const formattedData: DetailedInventoryAnalytics[] = data.map(item => ({
        item_id: item.item_id,
        type_name: item.inventory_types.type_name,
        zone_name: item.sectors.zones.zone_name,
        sector_name: item.sectors.sector_name,
        sku: item.sku,
        current_price: item.current_price,
        min_price: item.min_price,
        ltc: item.ltc,
        dimensions: item.dimensions,
        quantity: item.quantity,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        total_bookings: item.bookings.count,
        confirmed_bookings: item.bookings.filter.count,
        times_ordered: item.order_items.count,
        total_revenue: item.order_items.sum_price || 0
      }));

      return formattedData;
    },
  });
};