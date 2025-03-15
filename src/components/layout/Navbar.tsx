
import React, { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const notifications = [
    { id: 1, title: 'Nouveau post publié', message: 'Votre post sur LinkedIn a été publié avec succès', time: '2 min' },
    { id: 2, title: 'Commentaire reçu', message: 'Quelqu\'un a commenté sur votre post', time: '1h' },
    { id: 3, title: 'Mise à jour du système', message: 'Nouvelle fonctionnalité disponible', time: '3h' }
  ];

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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <Card className="border-0 shadow-none">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="p-0 max-h-80 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Aucune notification
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Navbar;
