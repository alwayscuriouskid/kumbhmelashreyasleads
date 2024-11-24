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
            *,
            inventory_items (
              *,
              inventory_types (
                id,
                name
              )
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      console.log('Fetched orders:', data);
      return data as Order[];
    },
  });
};