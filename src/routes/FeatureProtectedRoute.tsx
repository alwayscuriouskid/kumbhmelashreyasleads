import { Navigate } from "react-router-dom";
import { useFeaturePermission } from "@/hooks/useFeaturePermission";

interface FeatureProtectedRouteProps {
  children: React.ReactNode;
  feature: string;
}

export const FeatureProtectedRoute = ({ children, feature }: FeatureProtectedRouteProps) => {
  const { data: hasAccess, isLoading } = useFeaturePermission(feature);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!hasAccess) {
    return <Navigate to="/leads" replace />;
  }
  
  return <>{children}</>;
};