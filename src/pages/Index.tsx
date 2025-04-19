import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import AnalyticsOverview from '@/components/dashboard/AnalyticsOverview';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  // Sample data for posts - kept to maintain any dependencies, but not used in rendering
  const posts = [
    {
      id: '1',
      title: 'Lancement de notre nouveau produit',
      content: 'Nous sommes ravis de vous annoncer le lancement de notre nouveau produit innovant qui va révolutionner votre quotidien...',
      platforms: ['linkedin', 'twitter', 'facebook'] as ('linkedin' | 'twitter' | 'facebook' | 'instagram')[],
      keywords: ['lancement', 'produit', 'innovation'],
      scheduledDate: new Date('2023-06-15T10:00:00'),
      status: 'scheduled' as const,
    },
    {
      id: '2',
      title: 'Astuces pour améliorer votre productivité',
      content: 'Découvrez nos 5 astuces pour améliorer votre productivité au travail et atteindre vos objectifs plus rapidement...',
      platforms: ['linkedin', 'instagram'] as ('linkedin' | 'twitter' | 'facebook' | 'instagram')[],
      keywords: ['productivité', 'travail', 'astuces'],
      scheduledDate: new Date('2023-06-17T14:30:00'),
      status: 'draft' as const,
    },
    {
      id: '3',
      title: 'Événement annuel de networking',
      content: 'Rejoignez-nous pour notre événement annuel de networking où vous pourrez rencontrer des professionnels de votre secteur...',
      platforms: ['linkedin', 'facebook', 'twitter', 'instagram'] as ('linkedin' | 'twitter' | 'facebook' | 'instagram')[],
      keywords: ['événement', 'networking', 'rencontre'],
      scheduledDate: new Date('2023-06-10T18:00:00'),
      status: 'published' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        
        <main className="p-3 md:p-4 lg:p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Tableau de bord analytique</h1>
          </div>
          
          <div className="w-full">
            <AnalyticsOverview className="h-full min-h-[calc(100vh-140px)]" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
