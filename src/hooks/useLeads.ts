import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/leads";
import { useToast } from "@/hooks/use-toast";

export const useLeads = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      console.log("Fetching leads from database");
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching leads:", error);
        throw error;
      }

      console.log("Fetched leads:", data);
      return data || [];
    }
  });

  const addLead = useMutation({
    mutationFn: async (newLead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
      console.log("Adding new lead:", newLead);
      const { data, error } = await supabase
        .from('leads')
        .insert([newLead])
        .select()
        .single();

      if (error) {
        console.error("Error adding lead:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Lead Added",
        description: "New lead has been successfully added.",
      });
    },
    onError: (error) => {
      console.error("Error in addLead mutation:", error);
      toast({
        title: "Error",
        description: "Failed to add lead. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateLead = useMutation({
    mutationFn: async (updatedLead: Partial<Lead> & { id: string }) => {
      console.log("Updating lead:", updatedLead);
      const { data, error } = await supabase
        .from('leads')
        .update(updatedLead)
        .eq('id', updatedLead.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating lead:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Lead Updated",
        description: "Lead has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error("Error in updateLead mutation:", error);
      toast({
        title: "Error",
        description: "Failed to update lead. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    leads,
    isLoading,
    addLead,
    updateLead
  };
};