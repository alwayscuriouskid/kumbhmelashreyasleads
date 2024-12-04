import { createContext, useContext } from "react";

const AuthContext = createContext<{
  user: any;
  isAdmin: boolean;
}>({
  user: { id: 'temp-user', email: 'temp@example.com' },
  isAdmin: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Temporarily providing a mock user and admin status
  const mockUser = { 
    id: 'temp-user',
    email: 'temp@example.com',
  };
  
  console.log("AuthProvider: Authentication temporarily disabled, using mock user");

  return (
    <AuthContext.Provider value={{ user: mockUser, isAdmin: true }}>
      {children}
    </AuthContext.Provider>
  );
};