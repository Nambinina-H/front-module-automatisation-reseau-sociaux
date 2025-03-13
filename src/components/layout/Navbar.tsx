
import React from 'react';
import { Bell, Search } from 'lucide-react';
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
        'h-16 flex items-center justify-between px-6 bg-[#1A1F2C] bg-opacity-95 backdrop-blur-md border-b border-gray-700 sticky top-0 z-20 text-gray-200',
        className
      )}
    >
      <div className="flex-1">
        
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white hover:bg-[#2A2F3C]">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
