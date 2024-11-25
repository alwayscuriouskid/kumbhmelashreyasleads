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
            orders (
              status
            )
          )
        `);
      
      if (error) {
        console.error('Error fetching inventory items:', error);
        throw error;
      }

      return data.map(item => {
        // Calculate reserved quantity from confirmed orders
        const reservedQuantity = item.order_items
          ?.filter(oi => oi.orders?.status === 'approved')
          .length || 0;

        return {
          ...item,
          reserved_quantity: reservedQuantity,
          sold_quantity: 0, // This will need to be updated when we track sold items
          available_quantity: item.quantity - reservedQuantity
        } as InventoryItem;
      });
    },
  });
};