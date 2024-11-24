import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Booking } from "@/types/inventory";

export const useBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      console.log('Fetching bookings');
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          inventory_item:inventory_items!inner (
            *,
            inventory_type:inventory_types!inner (*)
          )
        `);
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      return data as Booking[];
    },
  });
};