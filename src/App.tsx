
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/layout/Sidebar";
import NavigationMenuBar from "./components/layout/NavigationMenuBar";
import { getCurrentUser } from "./lib/storage";
import { useEffect, useState } from "react";
import axios from "axios";

// Add this to make Axios include credentials
axios.defaults.withCredentials = true;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    // Check if the API server is running
    const checkServer = async () => {
      try {
        await axios.get('http://localhost:5000/api/users');
        console.log('Connected to MongoDB API server');
      } catch (error) {
        console.error('Could not connect to MongoDB API server. Make sure it is running.', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkServer();
  }, []);

  useEffect(() => {
    // Update user state when localStorage changes
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blood border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Connecting to database...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {user && (
            <>
              <NavigationMenuBar />
              <Sidebar />
            </>
          )}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/achievements" 
              element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
