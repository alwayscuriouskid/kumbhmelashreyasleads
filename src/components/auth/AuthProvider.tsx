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
        checkUserRole(session.user.id);
        if (event === "SIGNED_IN") {
          toast.success("Successfully signed in");
          navigate("/leads");
        }
      } else if (event === "SIGNED_OUT") {
        toast.info("Signed out");
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user role:", error);
        return;
      }

      console.log("User role:", data?.role);
      setIsAdmin(data?.role === "admin");
    } catch (error) {
      console.error("Error in checkUserRole:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};