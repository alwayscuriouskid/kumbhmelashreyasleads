import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useDeleteZone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting zone:', id);
      const { error } = await supabase
        .from('zones')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
      toast({
        title: "Success",
        description: "Zone deleted successfully",
      });
    },
  });
};

export const useDeleteSector = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting sector:', id);
      const { error } = await supabase
        .from('sectors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
      toast({
        title: "Success",
        description: "Sector deleted successfully",
      });
    },
  });
};

export const useDeleteInventoryType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Starting deletion check for inventory type:', id);
      
      // First check if there are any inventory items using this type
      const { data: items, error: checkError } = await supabase
        .from('inventory_items')
        .select('id')
        .eq('type_id', id);
      
      if (checkError) {
        console.error('Error checking inventory items:', checkError);
        throw checkError;
      }
      
      if (items && items.length > 0) {
        throw new Error('Cannot delete this type because it has associated inventory items. Please delete the items first.');
      }
      
      console.log('No associated items found, proceeding with deletion');
      
      const { error: deleteError } = await supabase
        .from('inventory_types')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        console.error('Error in deletion:', deleteError);
        throw deleteError;
      }
      
      console.log('Type deleted successfully');
      return id;
    },
    onSuccess: () => {
      console.log('Invalidating queries after successful deletion');
      queryClient.invalidateQueries({ queryKey: ["inventory_types"] });
    },
  });
};