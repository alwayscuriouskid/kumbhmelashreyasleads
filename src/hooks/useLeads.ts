import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead, LeadDB, dbToFrontend, frontendToDB } from "@/types/leads";
import { useToast } from "@/hooks/use-toast";
import { dummyLeads } from "./dummyData";

export const useLeads = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leads = dummyLeads, isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      console.log("Starting leads fetch...");
      
      // Check if we have an active session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error("Authentication error");
      }

      if (!session) {
        console.log("No active session found, returning dummy data");
        return dummyLeads;
      }

      console.log("Authenticated user:", session.user.email);
      console.log("Fetching leads from database");
      
      try {
        const { data, error: leadsError } = await supabase
          .from('leads')
          .select(`
            *,
            team_members (
              name,
              email
            )
          `)
          .order('created_at', { ascending: false });

        console.log("Supabase response:", { data, error: leadsError });

        if (leadsError) {
          console.error("Error fetching leads:", leadsError);
          toast({
            title: "Error fetching leads",
            description: leadsError.message,
            variant: "destructive",
          });
          return dummyLeads;
        }

        if (!data) {
          console.log("No leads data returned, using dummy data");
          return dummyLeads;
        }

        console.log("Fetched leads data:", data);
        const fetchedLeads = (data as LeadDB[]).map(dbToFrontend);
        console.log("Transformed leads:", fetchedLeads);
        return fetchedLeads.length > 0 ? fetchedLeads : dummyLeads;
      } catch (error) {
        console.error("Unexpected error during leads fetch:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching leads",
          variant: "destructive",
        });
        return dummyLeads;
      }
    },
    retry: 1
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
            client_name: newLead.clientName || '',
            contact_person: newLead.contactPerson || '',
            location: newLead.location || '',
            phone: newLead.phone || '',
            email: newLead.email || '',
            requirement: newLead.requirement || {},
            date: new Date().toISOString().split('T')[0],
            status: newLead.status || 'pending'
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
            client_name: updatedLead.clientName,
            contact_person: updatedLead.contactPerson,
            location: updatedLead.location,
            phone: updatedLead.phone,
            email: updatedLead.email,
            requirement: updatedLead.requirement,
            status: updatedLead.status
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
    error,
    addLead,
    updateLead
  };
};