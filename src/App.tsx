import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import VerifyEmail from "./pages/VerifyEmail";

const queryClient = new QueryClient();

// Define a type for the authentication check
interface ProtectedRouteProps {
  children: ReactNode;
}

// JWT authentication check function
const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  
  // If no token exists, user is not authenticated
  if (!token) return false;
  
  try {
    // Parse the JWT token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    
    // Check if the token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      // Token is expired, clear it and return false
      localStorage.removeItem("token");
      return false;
    }
    
    // Optional: Check the token issuer
    if (payload.iss && payload.iss !== "your-expected-issuer") {
      return false;
    }
    
    // Optional: Check the audience
    if (payload.aud && payload.aud !== "your-expected-audience") {
      return false;
    }
    
    // Token is valid
    return true;
  } catch (error) {
    // If token parsing fails, it's invalid
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    return false;
  }
};

// Protected Route component that redirects to /auth if not authenticated
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to /auth and store the page they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App = () => {
  // Use state to avoid hydration issues
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render routes until after client-side hydration
  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;