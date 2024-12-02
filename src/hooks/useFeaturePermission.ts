import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export const useFeaturePermission = (feature: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["feature-permission", feature, user?.email],
    queryFn: async () => {
      if (!user?.email) return false;

      const { data, error } = await supabase
        .from("feature_permissions")
        .select("*")
        .eq("email", user.email)
        .eq("feature", feature)
        .maybeSingle();

      if (error) {
        console.error("Error checking feature permission:", error);
        return false;
      }

      return !!data;
    },
    enabled: !!user?.email,
  });
};