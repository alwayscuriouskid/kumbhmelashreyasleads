import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead, LeadDB, dbToFrontend, frontendToDB } from "@/types/leads";
import { useToast } from "@/hooks/use-toast";
import { dummyLeads } from "./dummyData";

export const useLeads = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leads = dummyLeads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      console.log("Fetching leads from database");
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching leads:", error);
        return dummyLeads;
      }

      const fetchedLeads = (data as LeadDB[]).map(dbToFrontend);
      console.log("Fetched leads:", fetchedLeads);
      return fetchedLeads.length > 0 ? fetchedLeads : dummyLeads;
    }
  });

  const addLead = useMutation({
    mutationFn: async (newLead: Partial<Lead>) => {
      console.log("Adding new lead:", newLead);
      try {
        const dbLead = frontendToDB(newLead);
        console.log("Converted lead for DB:", dbLead);
        
        const { data, error } = await supabase
          .from('leads')
          .insert({
            ...dbLead,
            client_name: newLead.clientName || '',
            contact_person: newLead.contactPerson || '',
            location: newLead.location || '',
            phone: newLead.phone || '',
            email: newLead.email || '',
            requirement: newLead.requirement || {}
          })
          .select()
          .single();

        if (error) {
          console.error("Error adding lead:", error);
          throw error;
        }

        return dbToFrontend(data as LeadDB);
      } catch (error) {
        console.error("Error in addLead mutation:", error);
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
        if (!updatedLead.id || typeof updatedLead.id !== 'string') {
          throw new Error("Invalid lead ID format");
        }

        const dbLead = frontendToDB(updatedLead);
        console.log("Converted lead for DB update:", dbLead);

        const { data, error } = await supabase
          .from('leads')
          .update({
            ...dbLead,
            client_name: updatedLead.clientName,
            contact_person: updatedLead.contactPerson,
            location: updatedLead.location,
            phone: updatedLead.phone,
            email: updatedLead.email,
            requirement: updatedLead.requirement
          })
          .eq('id', updatedLead.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating lead:", error);
          throw error;
        }

        return dbToFrontend(data as LeadDB);
      } catch (error) {
        console.error("Error in updateLead mutation:", error);
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