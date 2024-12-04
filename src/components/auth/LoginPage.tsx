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
        return;
      }
      
      if (session?.user) {
        console.log("User already logged in, redirecting to /leads");
        navigate("/leads");
      }
    };

    checkSession();
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
          onError={(error) => {
            console.error("Auth error:", error);
            toast.error("Login failed. Please try again.");
          }}
        />
      </div>
    </div>
  );
};

export default LoginPage;