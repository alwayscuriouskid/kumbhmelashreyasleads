import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead, LeadDB, dbToFrontend, frontendToDB } from "@/types/leads";
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
      return (data || []).map(dbToFrontend);
    }
  });

  const addLead = useMutation({
    mutationFn: async (newLead: Partial<Lead>) => {
      console.log("Adding new lead:", newLead);
      try {
        const dbLead = frontendToDB(newLead);
        
        const { data, error } = await supabase
          .from('leads')
          .insert([dbLead])
          .select()
          .single();

        if (error) {
          console.error("Error adding lead:", error);
          throw error;
        }

        return dbToFrontend(data as LeadDB);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to add lead: ${error.message}`);
        }
        throw error;
      }
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
        description: error instanceof Error ? error.message : "Failed to add lead. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateLead = useMutation({
    mutationFn: async (updatedLead: Lead) => {
      console.log("Updating lead:", updatedLead);
      try {
        const dbLead = frontendToDB(updatedLead);

        const { data, error } = await supabase
          .from('leads')
          .update(dbLead)
          .eq('id', updatedLead.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating lead:", error);
          throw error;
        }

        return dbToFrontend(data as LeadDB);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to update lead: ${error.message}`);
        }
        throw error;
      }
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
        description: error instanceof Error ? error.message : "Failed to update lead. Please try again.",
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