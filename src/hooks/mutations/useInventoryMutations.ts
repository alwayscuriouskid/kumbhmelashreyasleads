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
      console.log('Deleting inventory type:', id);
      const { error } = await supabase
        .from('inventory_types')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      // Immediately update the cache to remove the deleted item
      queryClient.setQueryData(['inventory_types'], (oldData: any) => {
        return oldData?.filter((type: any) => type.id !== deletedId);
      });
      // Also invalidate the query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["inventory_types"] });
      toast({
        title: "Success",
        description: "Inventory type deleted successfully",
      });
    },
  });
};