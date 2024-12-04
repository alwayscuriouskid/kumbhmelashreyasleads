import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead, LeadDB, dbToFrontend } from "@/types/leads";
import { dummyLeads } from "../dummyData";
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
          console.log("No active session found, returning dummy data");
          return dummyLeads;
        }

        console.log("Authenticated user:", session.user.email);
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        console.log("User profile:", profile);

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
          toast.error("Error fetching leads");
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
        toast.error("An unexpected error occurred while fetching leads");
        return dummyLeads;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
};