import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log("No authenticated user, redirecting to login");
      toast.error("Please sign in to access this page");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;