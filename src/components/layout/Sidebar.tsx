import React from 'react';
import {
  Home,
  Calendar,
  BarChart2,
  Settings,
  LayoutDashboard,
  Wand2,
  LogOut,
  FileText,
  Users
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useApi';
import { toast } from '../ui/use-toast';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navigationItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={18} />,
    label: 'Tableau de bord',
    href: '/'
  },
  {
    icon: <Home size={18} />,
    label: 'Créer un post',
    href: '/creer-post'
  },
  // {
  //   icon: <Calendar size={18} />,
  //   label: 'Planification',
  //   href: '/planification'
  // },
  // {
  //   icon: <BarChart2 size={18} />,
  //   label: 'Analytique',
  //   href: '/analytique'
  // },
  {
    icon: <Wand2 size={18} />,
    label: "Génération de contenu",
    href: "/generation-contenu",
  },
  // {
  //   icon: <Users size={18} />,
  //   label: 'Gestion utilisateurs',
  //   href: '/gestion-utilisateurs'
  // },
  {
    icon: <FileText size={18} />,
    label: 'Logs',
    href: '/logs'
  },
  {
    icon: <Settings size={18} />,
    label: 'Paramètres',
    href: '/parametres'
  }
];

const Sidebar = () => {
  const location = useLocation();
  const { logout, appRole } = useAuth();

  console.log('Current app_role in Sidebar:', appRole);

  const handleLogout = () => {
    logout();
    toast({ description: 'Déconnexion réussie' });
  };

  return (
    <aside className="fixed left-0 top-0 z-50 h-full w-16 flex-none bg-[#1A1F2C] shadow-sm transition-all duration-300 md:w-60">
      <div className="flex h-full flex-col px-3 py-4 overflow-y-auto bg-[#1A1F2C]">
        <div className="mb-6 text-white text-center text-xl font-bold">
          <br/>
        </div>
        <ul className="space-y-2 font-medium flex-grow">
          {navigationItems.map((item) => {
            if (item.label === 'Logs' && appRole !== 'admin') {
              return null; // Hide "Logs" for non-admin users
            }
            return (
              <li key={item.label}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white',
                      isActive && 'bg-gray-700 text-white'
                    )
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto">
          <Separator className="my-2 bg-gray-600" />
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full flex items-center justify-start p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <span className="mr-3"><LogOut size={18} /></span>
            <span className="hidden md:inline">Déconnexion</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
