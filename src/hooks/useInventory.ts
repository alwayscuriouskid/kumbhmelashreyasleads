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

// Base queries for inventory data
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
            status
          )
        `);
      
      if (error) {
        console.error('Error fetching inventory items:', error);
        throw error;
      }

      // Calculate available quantity by subtracting active bookings
      return data.map(item => ({
        ...item,
        available_quantity: item.quantity - (item.bookings?.filter(b => b.status === 'confirmed').length || 0)
      }));
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
              inventory_types (*)
            )
          )
        `);
      
      if (error) throw error;
      return data as unknown as Order[];
    },
  });
};

export const useBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      console.log('Fetching bookings');
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          inventory_item:inventory_item_id (
            id,
            inventory_types (
              id, name
            )
          )
        `);
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      return data as unknown as Booking[];
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: {
      customer_name: string;
      customer_email?: string;
      customer_phone: string;
      customer_address?: string;
      team_member_id?: string;
      team_member_name: string;
      payment_method?: string;
      notes?: string;
      status: string;
      total_amount: number;
    }) => {
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

// New analytics specific queries
export const useInventoryMetrics = (timeRange: string = '7days') => {
  return useQuery({
    queryKey: ['inventory-metrics', timeRange],
    queryFn: async () => {
      console.log('Fetching inventory metrics for timeRange:', timeRange);
      const { data, error } = await supabase
        .from('inventory_detailed_metrics')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching inventory metrics:', error);
        throw error;
      }
      return data;
    },
  });
};

export const useTeamPerformanceMetrics = (timeRange: string = '7days') => {
  return useQuery({
    queryKey: ['team-performance-metrics', timeRange],
    queryFn: async () => {
      console.log('Fetching team performance metrics for timeRange:', timeRange);
      const { data, error } = await supabase
        .from('detailed_sales_metrics')
        .select('*')
        .order('month', { ascending: false });
      
      if (error) {
        console.error('Error fetching team performance metrics:', error);
        throw error;
      }
      return data;
    },
  });
};
