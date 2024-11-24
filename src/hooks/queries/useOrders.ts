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
          order_items (
            quantity,
            price,
            inventory_item_id,
            inventory_items (
              id,
              sku,
              inventory_types (
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