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
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error checking role:", error);
        if (error.code === 'PGRST116') {
          console.log("Creating new profile for user:", userId);
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ id: userId, role: 'user' }]);

          if (insertError) {
            console.error("Error creating profile:", insertError);
          }
        }
        return;
      }

      console.log("User profile found:", profile);
      setIsAdmin(profile?.role === 'admin');
    } catch (error) {
      console.error("Error in checkUserRole:", error);
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Setting up auth listeners");
    
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Current session:", session?.user?.email);
      if (session?.user) {
        setUser(session.user);
        checkUserRole(session.user.id);
      }
    });

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
          toast.success("Successfully signed in");
          navigate("/leads");
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        if (event === "SIGNED_OUT") {
          console.log("User signed out, redirecting to /login");
          toast.info("Signed out");
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