import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import CreatePost from "./pages/CreatePost";
import Schedule from "./pages/Schedule";
import Keywords from "./pages/Keywords";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ContentGeneration from "./pages/ContentGeneration";
import Auth from "./pages/Auth";
import Logs from "./pages/Logs";
import UserManagement from "./pages/UserManagement";
import Publications from "./pages/Publications";
import { apiService } from "./services/apiService";
import VideoTest from '@/components/test/VideoTest';

const queryClient = new QueryClient();

// Composant pour protéger les routes qui nécessitent une authentification
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = apiService.isAuthenticated();
  const location = useLocation();

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Composant pour rediriger les utilisateurs déjà authentifiés depuis la page de connexion
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = apiService.isAuthenticated();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  // Si l'utilisateur est déjà authentifié, rediriger vers la page d'où il vient ou l'accueil
  if (isAuthenticated && location.pathname === '/auth') {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Routes publiques */}
            <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
            
            {/* Routes protégées */}
            <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
            <Route path="/creer-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
            <Route path="/planification" element={<PrivateRoute><Schedule /></PrivateRoute>} />
            <Route path="/mots-cles" element={<PrivateRoute><Keywords /></PrivateRoute>} />
            <Route path="/analytique" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="/parametres" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/generation-contenu" element={<PrivateRoute><ContentGeneration /></PrivateRoute>} />
            <Route path="/gestion-utilisateurs" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
            <Route path="/logs" element={<PrivateRoute><Logs /></PrivateRoute>} />
            <Route path="/publications" element={<PrivateRoute><Publications /></PrivateRoute>} />
            <Route path="/video-test" element={<VideoTest />} />
            
            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
