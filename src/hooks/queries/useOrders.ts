import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Order } from "@/types/inventory";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      console.log('Fetching orders with items');
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items!inner (
            *,
            inventory_items!inner (
              *,
              inventory_types!inner (*)
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