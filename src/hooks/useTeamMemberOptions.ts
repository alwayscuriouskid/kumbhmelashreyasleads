import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeamMemberOptions = () => {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      console.log("Fetching team members from database");
      const { data, error } = await supabase
        .from("team_members")
        .select("id, name")
        .eq("status", "active")
        .order("name");

      if (error) {
        console.error("Error fetching team members:", error);
        throw error;
      }

      console.log("Fetched team members:", data);
      return data;
    },
  });
};