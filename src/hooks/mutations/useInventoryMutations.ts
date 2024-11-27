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
      console.log('Starting deletion mutation for inventory type:', id);
      const { error } = await supabase
        .from('inventory_types')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error in deletion mutation:', error);
        throw error;
      }
      console.log('Deletion mutation completed successfully');
      return id;
    },
    onSuccess: (deletedId) => {
      console.log('Mutation success, invalidating queries...');
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["inventory_types"] });
      queryClient.invalidateQueries({ queryKey: ["inventory_items"] });
    },
  });
};