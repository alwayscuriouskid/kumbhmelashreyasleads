import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext<{
  user: any;
  isAdmin: boolean;
}>({
  user: null,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("AuthProvider: Setting up auth listeners");

    // Check current session
    const initializeAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Current session:", session?.user?.email);
      
      if (error) {
        console.error("Error getting session:", error);
        toast({
          title: "Error checking session",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      if (session?.user) {
        console.log("Setting user from session:", session.user);
        setUser(session.user);
        
        // Ensure profile exists
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileCheckError || !existingProfile) {
          console.log("Creating new profile for user");
          const { error: createError } = await supabase
            .from('profiles')
            .insert([{ id: session.user.id, role: 'user' }]);

          if (createError) {
            console.error("Error creating profile:", createError);
          }
        }

        // Check if user has admin role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
        }
        
        setIsAdmin(profile?.role === 'admin');
        console.log("User role:", profile?.role);
      } else {
        console.log("No active session found");
        setUser(null);
        setIsAdmin(false);
        navigate("/login");
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);

        if (event === "SIGNED_OUT") {
          console.log("User signed out, clearing state and redirecting to /login");
          setUser(null);
          setIsAdmin(false);
          navigate("/login");
          return;
        }

        if (session?.user) {
          setUser(session.user);
          // Check user role on auth state change
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          setIsAdmin(profile?.role === 'admin');
          
          if (event === "SIGNED_IN") {
            console.log("User signed in, redirecting to /leads");
            navigate("/leads");
          }
        }
      }
    );

    // Cleanup
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};