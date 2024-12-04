import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LoginPage = () => {
  console.log("Rendering LoginPage");
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Checking existing session:", session?.user?.email);
      
      if (error) {
        console.error("Session check error:", error);
        toast.error("Error checking session");
        return;
      }
      
      if (session?.user) {
        console.log("User already logged in, redirecting to /leads");
        navigate("/leads");
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (event === "SIGNED_IN" && session) {
        console.log("Sign in successful, redirecting to /leads");
        toast.success("Successfully signed in!");
        navigate("/leads");
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        toast.info("Signed out");
      }
    });

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to Kumbhmela - Shreyas Leads
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in with your credentials
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000000',
                  brandAccent: '#333333',
                }
              }
            }
          }}
          providers={[]}
          redirectTo={window.location.origin}
          showLinks={false}
          view="sign_in"
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign In',
                loading_button_label: 'Signing in...',
              }
            }
          }}
          onlyThirdPartyProviders={false}
        />
      </div>
    </div>
  );
};

export default LoginPage;