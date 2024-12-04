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
    },
    retry: 1,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });
};