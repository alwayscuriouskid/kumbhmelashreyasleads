import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Zone, Sector, InventoryType, InventoryItem } from "@/types/inventory";

export const useZones = () => {
  return useQuery({
    queryKey: ["zones"],
    queryFn: async () => {
      console.log('Fetching zones');
      const { data, error } = await supabase
        .from("zones")
        .select("*");
      
      if (error) {
        console.error('Error fetching zones:', error);
        throw error;
      }
      return data as Zone[];
    },
  });
};

export const useSectors = () => {
  return useQuery({
    queryKey: ["sectors"],
    queryFn: async () => {
      console.log('Fetching sectors');
      const { data, error } = await supabase
        .from("sectors")
        .select("*, zones(*)");
      
      if (error) {
        console.error('Error fetching sectors:', error);
        throw error;
      }
      return data as (Sector & { zones: Zone })[];
    },
  });
};

export const useInventoryTypes = () => {
  return useQuery({
    queryKey: ["inventory_types"],
    queryFn: async () => {
      console.log('Fetching inventory types');
      const { data, error } = await supabase
        .from("inventory_types")
        .select("*");
      
      if (error) {
        console.error('Error fetching inventory types:', error);
        throw error;
      }
      return data as InventoryType[];
    },
  });
};

export const useInventoryItems = () => {
  return useQuery({
    queryKey: ["inventory_items"],
    queryFn: async () => {
      console.log('Fetching inventory items');
      const { data, error } = await supabase
        .from("inventory_items")
        .select(`
          *,
          inventory_types (
            id, name, total_quantity, unit_type
          ),
          sectors (
            id, name,
            zones (id, name)
          ),
          order_items (
            id,
            order_id,
            quantity,
            orders (
              status,
              payment_status
            )
          )
        `);
      
      if (error) {
        console.error('Error fetching inventory items:', error);
        throw error;
      }

      return data.map(item => {
        // Calculate quantities based on orders
        const orderItems = item.order_items || [];
        
        const reservedQuantity = orderItems
          .filter(oi => 
            oi.orders?.status === 'approved' && 
            oi.orders?.payment_status === 'pending'
          )
          .reduce((sum, oi) => sum + (oi.quantity || 0), 0);

        const soldQuantity = orderItems
          .filter(oi => 
            oi.orders?.status === 'approved' && 
            (oi.orders?.payment_status === 'finished' || oi.orders?.payment_status === 'partially_pending')
          )
          .reduce((sum, oi) => sum + (oi.quantity || 0), 0);

        const availableQuantity = item.quantity - (reservedQuantity + soldQuantity);

        return {
          ...item,
          reserved_quantity: reservedQuantity,
          sold_quantity: soldQuantity,
          available_quantity: availableQuantity
        } as InventoryItem;
      });
    },
  });
};