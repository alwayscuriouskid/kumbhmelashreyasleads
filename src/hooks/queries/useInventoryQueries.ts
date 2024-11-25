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
          bookings (
            id,
            status,
            quantity
          )
        `);
      
      if (error) {
        console.error('Error fetching inventory items:', error);
        throw error;
      }

      return data.map(item => {
        // Calculate reserved quantity from confirmed bookings
        const reservedQuantity = item.bookings
          ?.filter(b => b.status === 'confirmed')
          .reduce((sum, booking) => sum + (booking.quantity || 1), 0) || 0;

        // For now, we'll set sold_quantity to 0 since it's not tracked in the database
        // In a real application, you might want to track this separately
        const soldQuantity = 0;

        return {
          ...item,
          reserved_quantity: reservedQuantity,
          sold_quantity: soldQuantity,
          available_quantity: item.quantity - reservedQuantity
        } as InventoryItem;
      });
    },
  });
};