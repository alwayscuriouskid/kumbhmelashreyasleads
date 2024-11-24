import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Order } from "@/types/inventory";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      console.log('Fetching orders');
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items!order_items_order_id_fkey (
            *,
            inventory_items!order_items_inventory_item_id_fkey (
              *,
              inventory_types!inventory_items_type_id_fkey (
                id,
                name
              )
            )
          )
        `);
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      console.log('Fetched orders:', data);
      return data as Order[];
    },
  });
};