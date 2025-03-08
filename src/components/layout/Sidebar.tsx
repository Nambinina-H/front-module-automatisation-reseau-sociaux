
import React from 'react';
import {
  Home,
  Calendar,
  BarChart2,
  Settings,
  Hash,
  LayoutDashboard,
  Wand2,
  LogOut
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
    label: 'Posts',
    href: '/create'
  },
  {
    icon: <Calendar size={18} />,
    label: 'Calendrier',
    href: '/schedule'
  },
  {
    icon: <Hash size={18} />,
    label: 'Mots-clés',
    href: '/keywords'
  },
  {
    icon: <BarChart2 size={18} />,
    label: 'Analytique',
    href: '/analytics'
  },
  {
    icon: <Wand2 size={18} />,
    label: "Génération de contenu",
    href: "/content-generation",
  },
  {
    icon: <Settings size={18} />,
    label: 'Paramètres',
    href: '/settings'
  }
];

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    // Ici, vous pourriez ajouter la logique de déconnexion réelle
    console.log('Déconnexion');
    // Par exemple: auth.signOut(), localStorage.clear(), etc.
  };

  return (
    <aside className="fixed left-0 top-0 z-50 h-full w-16 flex-none bg-white shadow-sm transition-all duration-300 md:w-60">
      <div className="flex h-full flex-col px-3 py-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium flex-grow">
          {navigationItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                    isActive && 'bg-gray-100 text-gray-900'
                  )
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        
        {/* Bouton de déconnexion en bas de la barre latérale */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <span className="mr-3"><LogOut size={18} /></span>
            <span className="hidden md:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
