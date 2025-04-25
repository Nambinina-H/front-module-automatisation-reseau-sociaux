import React from 'react';
import { useAuth } from '@/hooks/useApi';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { user } = useAuth();
  
  // Obtenir les initiales de l'email pour l'avatar
  const getInitials = (email: string | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <header 
      className={cn(
        'h-16 flex items-center justify-between px-6 bg-white bg-opacity-70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20',
        className
      )}
    >
      <div className="flex-1">
        
      </div>
      
      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(user.email)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:inline">{user.email}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
