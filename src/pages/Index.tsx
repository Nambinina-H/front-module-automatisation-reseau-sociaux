
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import PostCard from '@/components/dashboard/PostCard';
import AnalyticsOverview from '@/components/dashboard/AnalyticsOverview';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  // Sample data for posts
  const posts = [
    {
      id: '1',
      title: 'Lancement de notre nouveau produit',
      content: 'Nous sommes ravis de vous annoncer le lancement de notre nouveau produit innovant qui va révolutionner votre quotidien...',
      platforms: ['linkedin', 'twitter', 'facebook'] as const,
      keywords: ['lancement', 'produit', 'innovation'],
      scheduledDate: new Date('2023-06-15T10:00:00'),
      status: 'scheduled' as const,
    },
    {
      id: '2',
      title: 'Astuces pour améliorer votre productivité',
      content: 'Découvrez nos 5 astuces pour améliorer votre productivité au travail et atteindre vos objectifs plus rapidement...',
      platforms: ['linkedin', 'instagram'] as const,
      keywords: ['productivité', 'travail', 'astuces'],
      scheduledDate: new Date('2023-06-17T14:30:00'),
      status: 'draft' as const,
    },
    {
      id: '3',
      title: 'Événement annuel de networking',
      content: 'Rejoignez-nous pour notre événement annuel de networking où vous pourrez rencontrer des professionnels de votre secteur...',
      platforms: ['linkedin', 'facebook', 'twitter', 'instagram'] as const,
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
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Tableau de bord</h1>
            <Button className="button-effect" iconLeft={<Plus size={16} />}>
              Nouveau post
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <AnalyticsOverview />
            </div>
            
            <div className="glass-panel rounded-lg p-4 border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Posts à venir</h2>
              <div className="space-y-3">
                {posts
                  .filter(post => post.status === 'scheduled')
                  .map(post => (
                    <div key={post.id} className="bg-white rounded-md p-3 border border-gray-100 shadow-sm">
                      <p className="font-medium">{post.title}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex space-x-1">
                          {post.platforms.map(platform => (
                            <PlatformIcon key={platform} platform={platform} size={16} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(post.scheduledDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-medium mb-4">Vos posts récents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {posts.map((post, index) => (
              <div key={post.id} className={`animate-slide-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                <PostCard {...post} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
