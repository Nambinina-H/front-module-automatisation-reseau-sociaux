
import React, { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NavbarProps {
  className?: string;
}

const mockNotifications = [
  { id: 1, title: 'Nouveau post', message: 'Un nouveau post a été publié', time: '5 min' },
  { id: 2, title: 'Contenu généré', message: 'Votre contenu a été généré avec succès', time: '10 min' },
  { id: 3, title: 'Publication programmée', message: 'Rappel de publication prévue à 15:00', time: '1 heure' },
];

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [open, setOpen] = useState(false);

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
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <div className="p-4 border-b">
              <h3 className="font-medium text-sm">Notifications</h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {mockNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="p-3 hover:bg-slate-100 border-b last:border-b-0 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <span className="text-xs text-slate-500">{notification.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                </div>
              ))}
            </div>
            <div className="p-2 border-t">
              <Button variant="ghost" size="sm" className="w-full text-sm">
                Voir toutes les notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Navbar;
