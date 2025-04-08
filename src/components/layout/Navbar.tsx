import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
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
        
      </div>
    </header>
  );
};

export default Navbar;
