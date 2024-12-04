import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead, LeadDB, dbToFrontend } from "@/types/leads";
import { toast } from "sonner";

export const useLeadQueries = () => {
  console.log("Initializing useLeadQueries hook");
  
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      console.log("Starting leads fetch...");
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw new Error("Authentication error");
        }

        if (!session) {
          console.log("No active session found");
          throw new Error("No authenticated session");
        }

        console.log("Authenticated user:", session.user.email);
        
        const { data, error: leadsError } = await supabase
          .from('leads')
          .select(`
            *,
            team_members (
              name,
              email
            ),
            activities (
              id,
              type,
              notes,
              created_at
            )
          `)
          .order('created_at', { ascending: false });

        console.log("Supabase response:", { data, error: leadsError });

        if (leadsError) {
          console.error("Error fetching leads:", leadsError);
          toast.error("Error fetching leads");
          throw leadsError;
        }

        if (!data) {
          console.log("No leads data returned");
          return [];
        }

        console.log("Fetched leads data:", data);
        const fetchedLeads = (data as LeadDB[]).map(dbToFrontend);
        console.log("Transformed leads:", fetchedLeads);
        return fetchedLeads;
      } catch (error) {
        console.error("Unexpected error during leads fetch:", error);
        toast.error("An unexpected error occurred while fetching leads");
        throw error;
      }
    },
    retry: 1,
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
};