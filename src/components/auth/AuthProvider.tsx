import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false });

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const checkUserRole = async (userId: string) => {
    try {
      console.log("Checking user role for:", userId);
      
      // First try to get existing profile
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error checking role:", error);
        
        if (error.code === 'PGRST116') {
          console.log("No profile found, creating new profile for user:", userId);
          
          // Create new profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ id: userId, role: 'user' }]);

          if (insertError) {
            console.error("Error creating profile:", insertError);
            toast.error("Error setting up user profile");
            return;
          }

          // Fetch the newly created profile
          const { data: newProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

          if (fetchError) {
            console.error("Error fetching new profile:", fetchError);
            toast.error("Error retrieving user profile");
            return;
          }

          profile = newProfile;
          toast.success("Profile created successfully");
        } else {
          toast.error("Error checking user role");
          return;
        }
      }

      console.log("User profile:", profile);
      setIsAdmin(profile?.role === 'admin');
    } catch (error) {
      console.error("Error in checkUserRole:", error);
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Setting up auth listeners");

    // Check current session
    const initializeAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Current session:", session?.user?.email);
      
      if (error) {
        console.error("Error getting session:", error);
        toast.error("Error checking session");
        return;
      }
      
      if (session?.user) {
        setUser(session.user);
        await checkUserRole(session.user.id);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (session?.user) {
        setUser(session.user);
        await checkUserRole(session.user.id);
        
        if (event === "SIGNED_IN") {
          console.log("User signed in, redirecting to /leads");
          navigate("/leads");
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        if (event === "SIGNED_OUT") {
          console.log("User signed out, redirecting to /login");
          navigate("/login");
        }
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};