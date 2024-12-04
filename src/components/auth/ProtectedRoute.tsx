const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  console.log("ProtectedRoute: Authentication check bypassed");
  return <>{children}</>;
};

export default ProtectedRoute;