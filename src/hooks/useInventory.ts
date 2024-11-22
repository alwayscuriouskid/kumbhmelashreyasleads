import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { 
  Zone, 
  Sector, 
  InventoryType, 
  InventoryItem, 
  Order, 
  Booking 
} from "@/types/inventory";

export const useZones = () => {
  return useQuery({
    queryKey: ["zones"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("zones")
        .select("*");
      
      if (error) throw error;
      return data as Zone[];
    },
  });
};

export const useSectors = () => {
  return useQuery({
    queryKey: ["sectors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sectors")
        .select("*, zones(*)");
      
      if (error) throw error;
      return data as (Sector & { zones: Zone })[];
    },
  });
};

export const useInventoryTypes = () => {
  return useQuery({
    queryKey: ["inventory_types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_types")
        .select("*");
      
      if (error) throw error;
      return data as InventoryType[];
    },
  });
};

export const useInventoryItems = () => {
  return useQuery({
    queryKey: ["inventory_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select(`
          *,
          inventory_types (name),
          sectors (name, zones (name))
        `);
      
      if (error) throw error;
      return data as (InventoryItem & {
        inventory_types: { name: string };
        sectors: { name: string; zones: { name: string } };
      })[];
    },
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            inventory_items (
              *,
              inventory_types (name)
            )
          )
        `);
      
      if (error) throw error;
      return data as Order[];
    },
  });
};

export const useBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          inventory_items (
            *,
            inventory_types (name)
          )
        `);
      
      if (error) throw error;
      return data as (Booking & {
        inventory_items: {
          inventory_types: { name: string }
        }
      })[];
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: Omit<Order, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Success",
        description: "Order created successfully",
      });
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingData: Omit<Booking, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("bookings")
        .insert([bookingData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: "Success",
        description: "Booking created successfully",
      });
    },
  });
};