
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard, 
  MessageSquarePlus, 
  Calendar,
  KeySquare,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  // Auto-collapse on mobile
  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  const toggleCollapse = () => setCollapsed(!collapsed);

  const navItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', href: '/' },
    { icon: MessageSquarePlus, label: 'Créer un post', href: '/create' },
    { icon: Calendar, label: 'Planification', href: '/schedule' },
    { icon: KeySquare, label: 'Mots-clés', href: '/keywords' },
    { icon: BarChart3, label: 'Analytiques', href: '/analytics' },
    { icon: Settings, label: 'Paramètres', href: '/settings' },
  ];

  return (
    <div
      className={cn(
        'h-screen fixed left-0 top-0 z-30 flex flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-60',
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={cn('flex items-center space-x-2', collapsed && 'w-full justify-center')}>
          {!collapsed && (
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              SocialFlow
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className={cn('p-1', collapsed && 'absolute -right-3 top-5 bg-white border shadow-sm rounded-full h-6 w-6')}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2 subtle-scroll">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center space-x-2 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-md transition-all duration-200 p-2',
              collapsed ? 'justify-center' : 'px-3'
            )}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className={cn(
          'flex items-center space-x-2',
          collapsed && 'justify-center'
        )}>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
            UN
          </div>
          {!collapsed && (
            <div className="text-sm">
              <p className="font-medium text-gray-700">Utilisateur</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
