
import React, { useState, useEffect } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { cn } from '@/lib/utils';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/20">
      <div 
        className={cn(
          "w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200",
          "transition-all duration-500 ease-out",
          isLoading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        )}
      >
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <AuthForm />
        )}
      </div>

      <div className={cn(
        "mt-8 text-center text-sm text-muted-foreground transition-opacity duration-300",
        isLoading ? "opacity-0" : "opacity-100"
      )}>
        Module de Génération de Contenu — Votre plateforme de gestion de contenu
      </div>
    </div>
  );
};

export default Auth;
