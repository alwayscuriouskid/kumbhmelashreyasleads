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
      console.log("Checking user role for ID:", userId);
      
      // First try to get the profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching user profile:", fetchError);
        // Continue with default state but don't block the auth flow
        setIsAdmin(false);
        return;
      }

      // If profile doesn't exist, create it
      if (!existingProfile) {
        console.log("Creating new profile for user:", userId);
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId,
            role: 'user' 
          }]);

        if (insertError) {
          console.error("Error creating user profile:", insertError);
          // Continue with default state
          setIsAdmin(false);
          return;
        }

        console.log("Successfully created new profile");
        setIsAdmin(false);
        return;
      }

      // If we have a profile, set the admin status
      console.log("Found existing profile with role:", existingProfile.role);
      setIsAdmin(existingProfile.role === "admin");
    } catch (error) {
      console.error("Unexpected error in checkUserRole:", error);
      // Continue with default state
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    console.log("Setting up auth state...");
    
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Current session:", session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserRole(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await checkUserRole(session.user.id);
        if (event === "SIGNED_IN") {
          toast.success("Successfully signed in");
          navigate("/leads");
        }
      } else if (event === "SIGNED_OUT") {
        setIsAdmin(false);
        toast.info("Signed out");
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};