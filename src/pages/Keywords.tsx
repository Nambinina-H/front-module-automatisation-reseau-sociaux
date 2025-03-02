
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Badge from '@/components/common/Badge';
import { Button } from '@/components/ui/button';
import { Hash, Plus, Search, Trash2 } from 'lucide-react';

const Keywords = () => {
  // Sample keyword categories
  const [categories, setCategories] = useState([
    {
      id: '1',
      name: 'Produits',
      keywords: ['innovation', 'lancement', 'produit', 'technologie', 'nouveauté']
    },
    {
      id: '2',
      name: 'Marketing',
      keywords: ['stratégie', 'marketing', 'croissance', 'acquisition', 'promotion']
    },
    {
      id: '3',
      name: 'Événements',
      keywords: ['conférence', 'webinaire', 'networking', 'séminaire', 'atelier']
    }
  ]);
  
  const [newCategory, setNewCategory] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([
        ...categories,
        {
          id: Date.now().toString(),
          name: newCategory,
          keywords: []
        }
      ]);
      setNewCategory('');
    }
  };
  
  const handleAddKeyword = () => {
    if (selectedCategory && newKeyword.trim()) {
      setCategories(categories.map(category => 
        category.id === selectedCategory
          ? { ...category, keywords: [...category.keywords, newKeyword.trim().toLowerCase()] }
          : category
      ));
      setNewKeyword('');
    }
  };
  
  const handleRemoveKeyword = (categoryId: string, keyword: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId
        ? { ...category, keywords: category.keywords.filter(k => k !== keyword) }
        : category
    ));
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(category => category.id !== categoryId));
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    }
  };
  
  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Mots-clés</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Catégories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nouvelle catégorie"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <Button onClick={handleAddCategory} size="icon" variant="outline">
                      <Plus size={16} />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    {categories.map(category => (
                      <div
                        key={category.id}
                        className={`flex justify-between items-center p-2 rounded cursor-pointer transition-colors ${selectedCategory === category.id ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="flex items-center">
                          <Hash size={16} className="mr-2" />
                          <span>{category.name}</span>
                          <span className="ml-2 text-xs text-gray-500">({category.keywords.length})</span>
                        </div>
                        {selectedCategory === category.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category.id);
                            }}
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Gestion des mots-clés</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedCategory ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ajouter un mot-clé"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                        />
                        <Button onClick={handleAddKeyword} disabled={!newKeyword.trim()}>
                          <Plus size={16} className="mr-2" />
                          Ajouter
                        </Button>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-medium mb-3">
                          {categories.find(c => c.id === selectedCategory)?.name} - Mots-clés
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {categories
                            .find(c => c.id === selectedCategory)
                            ?.keywords.map(keyword => (
                              <Badge
                                key={keyword}
                                variant="secondary"
                                className="py-1 px-3 cursor-pointer"
                                onClick={() => handleRemoveKeyword(selectedCategory, keyword)}
                              >
                                #{keyword} <span className="ml-1">×</span>
                              </Badge>
                            ))}
                          {categories.find(c => c.id === selectedCategory)?.keywords.length === 0 && (
                            <p className="text-gray-500 text-sm">Aucun mot-clé pour cette catégorie.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : searchTerm ? (
                    <div>
                      <h3 className="font-medium mb-4">Résultats de recherche pour "{searchTerm}"</h3>
                      
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map(category => (
                          <div key={category.id} className="mb-6">
                            <h4 className="font-medium text-sm text-gray-600 mb-2">{category.name}</h4>
                            <div className="flex flex-wrap gap-2">
                              {category.keywords
                                .filter(keyword => keyword.includes(searchTerm.toLowerCase()))
                                .map(keyword => (
                                  <Badge
                                    key={keyword}
                                    variant="secondary"
                                    className="py-1 px-3"
                                  >
                                    #{keyword}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-10 text-gray-500">Aucun résultat trouvé</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      <Hash className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p>Sélectionnez une catégorie pour gérer ses mots-clés</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Keywords;
