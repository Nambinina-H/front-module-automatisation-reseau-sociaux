
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PostCard from '@/components/dashboard/PostCard';
import { Calendar, LayoutList } from 'lucide-react';

const Content = () => {
  // Sample data for demonstration purposes
  const publishedPosts = [
    {
      id: '1',
      title: 'Le guide complet du marketing digital',
      content: 'Découvrez les meilleures stratégies de marketing digital pour développer votre entreprise en 2023...',
      platforms: ['linkedin', 'facebook'] as ('linkedin' | 'twitter' | 'facebook' | 'instagram')[],
      keywords: ['marketing', 'digital', 'stratégie'],
      scheduledDate: new Date('2023-05-10T14:30:00'),
      status: 'published' as const,
    },
    {
      id: '2',
      title: 'Comment optimiser votre SEO',
      content: 'Les techniques les plus efficaces pour améliorer votre référencement naturel et augmenter votre visibilité...',
      platforms: ['linkedin', 'twitter'] as ('linkedin' | 'twitter' | 'facebook' | 'instagram')[],
      keywords: ['SEO', 'référencement', 'Google'],
      scheduledDate: new Date('2023-05-15T10:00:00'),
      status: 'published' as const,
    },
    {
      id: '3',
      title: '5 tendances e-commerce à suivre',
      content: 'Les nouvelles tendances qui transforment le secteur du e-commerce et comment les adopter pour votre business...',
      platforms: ['linkedin', 'facebook', 'instagram'] as ('linkedin' | 'twitter' | 'facebook' | 'instagram')[],
      keywords: ['e-commerce', 'tendances', 'vente en ligne'],
      scheduledDate: new Date('2023-05-20T16:45:00'),
      status: 'published' as const,
    },
  ];

  const scheduledPosts = [
    {
      id: '4',
      title: 'Webinaire: Transformation digitale',
      content: 'Rejoignez notre webinaire exclusif sur la transformation digitale des entreprises post-covid...',
      platforms: ['linkedin', 'twitter', 'facebook'] as ('linkedin' | 'twitter' | 'facebook' | 'instagram')[],
      keywords: ['webinaire', 'transformation', 'digital'],
      scheduledDate: new Date('2023-06-05T11:00:00'),
      status: 'scheduled' as const,
    },
    {
      id: '5',
      title: 'Lancement de notre nouvelle offre',
      content: 'Nous sommes ravis de vous annoncer le lancement de notre nouvelle offre de services premium...',
      platforms: ['linkedin', 'instagram', 'facebook'] as ('linkedin' | 'twitter' | 'facebook' | 'instagram')[],
      keywords: ['lancement', 'offre', 'services'],
      scheduledDate: new Date('2023-06-10T09:30:00'),
      status: 'scheduled' as const,
    },
  ];

  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Publications</h1>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setView('grid')} 
                className={`p-2 rounded-md ${view === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              >
                <LayoutList size={20} />
              </button>
              <button 
                onClick={() => setView('list')} 
                className={`p-2 rounded-md ${view === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              >
                <Calendar size={20} />
              </button>
            </div>
          </div>
          
          <Tabs defaultValue="published" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="published">Publiés</TabsTrigger>
              <TabsTrigger value="scheduled">Planifiés</TabsTrigger>
            </TabsList>
            
            <TabsContent value="published">
              <Card>
                <CardHeader>
                  <CardTitle>Publications publiées</CardTitle>
                </CardHeader>
                <CardContent>
                  {publishedPosts.length > 0 ? (
                    <div className={`${view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                      {publishedPosts.map((post) => (
                        <PostCard
                          key={post.id}
                          id={post.id}
                          title={post.title}
                          content={post.content}
                          platforms={post.platforms}
                          keywords={post.keywords}
                          scheduledDate={post.scheduledDate}
                          status={post.status}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Aucune publication publiée</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="scheduled">
              <Card>
                <CardHeader>
                  <CardTitle>Publications planifiées</CardTitle>
                </CardHeader>
                <CardContent>
                  {scheduledPosts.length > 0 ? (
                    <div className={`${view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                      {scheduledPosts.map((post) => (
                        <PostCard
                          key={post.id}
                          id={post.id}
                          title={post.title}
                          content={post.content}
                          platforms={post.platforms}
                          keywords={post.keywords}
                          scheduledDate={post.scheduledDate}
                          status={post.status}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Aucune publication planifiée</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Content;
