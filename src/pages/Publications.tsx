import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Publication1 from '@/components/publications/Publication1';
import { Button } from '@/components/ui/button';
import { usePublications } from '@/hooks/usePublications';

const Publications = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const { publications, loading, error, pagination, nextPage, previousPage } = usePublications();

  // Filtres en fonction du statut (publié/planifié)
  const filteredPosts = activeTab === 'all' 
    ? publications 
    : publications.filter(post => post.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        
        <main className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-semibold mb-3 md:mb-0">Publications</h1>
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
            
            {error ? (
              <div className="p-8 text-center text-red-500">
                {error}
              </div>
            ) : (
              <>
                <TabsContent value="all" className="mt-4">
                  <Publication1 posts={filteredPosts} isLoading={loading} />
                </TabsContent>
                
                <TabsContent value="published" className="mt-4">
                  <Publication1 posts={filteredPosts} isLoading={loading} />
                </TabsContent>
                
                <TabsContent value="scheduled" className="mt-4">
                  <Publication1 posts={filteredPosts} isLoading={loading} />
                </TabsContent>
              </>
            )}
            
            {/* Pagination */}
            {!loading && !error && publications.length > 0 && (
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline" 
                  onClick={previousPage}
                  disabled={!pagination.hasPreviousPage}
                >
                  Précédent
                </Button>
                <span className="py-2">
                  Page {pagination.page} sur {pagination.totalPages}
                </span>
                <Button 
                  variant="outline" 
                  onClick={nextPage}
                  disabled={!pagination.hasNextPage}
                >
                  Suivant
                </Button>
              </div>
            )}
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Publications;
