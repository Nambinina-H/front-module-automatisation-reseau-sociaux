import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Grid3X3, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Publication1 from '@/components/publications/Publication1';
import { Button } from '@/components/ui/button';

// Types fictifs pour l'exemple
type Content = {
  id: string;
  title: string;
  content: string;
  platforms: Array<'linkedin' | 'instagram' | 'twitter' | 'facebook'>;
  keywords: string[];
  scheduledDate: Date;
  status: 'scheduled' | 'published' | 'draft';
};

const Publications = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Données d'exemple - à remplacer par les vraies données de l'API
  const samplePosts: Content[] = [
    {
      id: '1',
      title: 'Lancement de notre nouveau produit',
      content: 'Nous sommes ravis de vous annoncer le lancement de notre nouveau produit innovant qui va révolutionner votre quotidien...',
      platforms: ['linkedin', 'twitter', 'facebook'],
      keywords: ['lancement', 'produit', 'innovation'],
      scheduledDate: new Date('2023-06-15T10:00:00'),
      status: 'published',
    },
    {
      id: '2',
      title: 'Astuces pour améliorer votre productivité',
      content: 'Découvrez nos 5 astuces pour améliorer votre productivité au travail et atteindre vos objectifs plus rapidement...',
      platforms: ['linkedin', 'instagram'],
      keywords: ['productivité', 'travail', 'astuces'],
      scheduledDate: new Date('2023-06-17T14:30:00'),
      status: 'scheduled',
    },
    {
      id: '3',
      title: 'Événement annuel de networking',
      content: 'Rejoignez-nous pour notre événement annuel de networking où vous pourrez rencontrer des professionnels de votre secteur...',
      platforms: ['linkedin', 'facebook', 'twitter', 'instagram'],
      keywords: ['événement', 'networking', 'rencontre'],
      scheduledDate: new Date('2023-06-10T18:00:00'),
      status: 'published',
    },
    {
      id: '4',
      title: 'Comment optimiser votre présence sur LinkedIn',
      content: 'Les meilleurs conseils pour optimiser votre profil LinkedIn et augmenter votre visibilité professionnelle...',
      platforms: ['linkedin'],
      keywords: ['linkedin', 'réseau', 'professionnel'],
      scheduledDate: new Date('2023-06-20T09:00:00'),
      status: 'scheduled',
    },
    {
      id: '5',
      title: 'Tendances marketing pour 2023',
      content: 'Découvrez les tendances marketing qui vont dominer en 2023 et comment les intégrer dans votre stratégie...',
      platforms: ['twitter', 'facebook', 'linkedin'],
      keywords: ['marketing', 'tendances', '2023'],
      scheduledDate: new Date('2023-06-05T11:00:00'),
      status: 'published',
    },
    {
      id: '6',
      title: 'Étude de cas : Comment nous avons augmenté nos conversions de 200%',
      content: 'Une analyse détaillée de notre stratégie qui a permis d\'augmenter nos conversions de manière significative...',
      platforms: ['linkedin', 'facebook'],
      keywords: ['étude', 'cas', 'conversion'],
      scheduledDate: new Date('2023-06-25T16:00:00'),
      status: 'scheduled',
    },
  ];

  // Filtres en fonction du statut (publié/planifié)
  const filteredPosts = activeTab === 'all' 
    ? samplePosts 
    : samplePosts.filter(post => post.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        
        <main className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-semibold mb-3 md:mb-0">Publications</h1>
            
            <div className="flex space-x-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={16} className="mr-1" /> Grille
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setViewMode('list')}
              >
                <List size={16} className="mr-1" /> Liste
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Plateforme</label>
                  <select className="w-full p-2 border rounded">
                    <option value="">Toutes les plateformes</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date de début</label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date de fin</label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="published">Publiés</TabsTrigger>
              <TabsTrigger value="scheduled">Planifiés</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <Publication1 posts={filteredPosts} viewMode={viewMode} />
            </TabsContent>
            
            <TabsContent value="published" className="mt-4">
              <Publication1 posts={filteredPosts} viewMode={viewMode} />
            </TabsContent>
            
            <TabsContent value="scheduled" className="mt-4">
              <Publication1 posts={filteredPosts} viewMode={viewMode} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Publications;
