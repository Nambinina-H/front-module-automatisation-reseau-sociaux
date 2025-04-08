
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Grid3X3, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Publication1 from '@/components/publications/Publication1';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const itemsPerPage = 6;

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

  // Application des filtres
  const applyFilters = () => {
    let filtered = samplePosts;
    
    // Filtre par statut (publié/planifié)
    if (activeTab !== 'all') {
      filtered = filtered.filter(post => post.status === activeTab);
    }
    
    // Filtre par plateforme
    if (selectedPlatform) {
      filtered = filtered.filter(post => 
        post.platforms.includes(selectedPlatform as 'linkedin' | 'instagram' | 'twitter' | 'facebook')
      );
    }
    
    // Filtre par date de début
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(post => post.scheduledDate >= start);
    }
    
    // Filtre par date de fin
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Fin de journée
      filtered = filtered.filter(post => post.scheduledDate <= end);
    }
    
    return filtered;
  };

  const filteredPosts = applyFilters();
  
  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  
  // Générer les liens de pagination
  const generatePaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Afficher toutes les pages si leur nombre est inférieur au max visible
      for (let i = 1; i <= totalPages; i++) {
        links.push(i);
      }
    } else {
      // Toujours inclure la première page
      links.push(1);
      
      // Calculer les pages autour de la page courante
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Ajuster si nous sommes près du début ou de la fin
      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Ajouter ellipsis après la première page si nécessaire
      if (startPage > 2) {
        links.push('ellipsis-start');
      }
      
      // Ajouter les pages intermédiaires
      for (let i = startPage; i <= endPage; i++) {
        links.push(i);
      }
      
      // Ajouter ellipsis avant la dernière page si nécessaire
      if (endPage < totalPages - 1) {
        links.push('ellipsis-end');
      }
      
      // Toujours inclure la dernière page
      if (totalPages > 1) {
        links.push(totalPages);
      }
    }
    
    return links;
  };

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
                  <select 
                    className="w-full p-2 border rounded"
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                  >
                    <option value="">Toutes les plateformes</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date de début</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date de fin</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
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
              <Publication1 posts={paginatedPosts} viewMode={viewMode} />
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious href="#" onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(prev => Math.max(1, prev - 1));
                          }} />
                        </PaginationItem>
                      )}
                      
                      {generatePaginationLinks().map((page, index) => (
                        typeof page === 'number' ? (
                          <PaginationItem key={`page-${page}`}>
                            <PaginationLink 
                              href="#" 
                              isActive={currentPage === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      ))}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext href="#" onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(prev => Math.min(totalPages, prev + 1));
                          }} />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="published" className="mt-4">
              <Publication1 posts={paginatedPosts} viewMode={viewMode} />
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious href="#" onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(prev => Math.max(1, prev - 1));
                          }} />
                        </PaginationItem>
                      )}
                      
                      {generatePaginationLinks().map((page, index) => (
                        typeof page === 'number' ? (
                          <PaginationItem key={`page-${page}`}>
                            <PaginationLink 
                              href="#" 
                              isActive={currentPage === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      ))}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext href="#" onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(prev => Math.min(totalPages, prev + 1));
                          }} />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="scheduled" className="mt-4">
              <Publication1 posts={paginatedPosts} viewMode={viewMode} />
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious href="#" onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(prev => Math.max(1, prev - 1));
                          }} />
                        </PaginationItem>
                      )}
                      
                      {generatePaginationLinks().map((page, index) => (
                        typeof page === 'number' ? (
                          <PaginationItem key={`page-${page}`}>
                            <PaginationLink 
                              href="#" 
                              isActive={currentPage === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      ))}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext href="#" onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(prev => Math.min(totalPages, prev + 1));
                          }} />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Publications;
