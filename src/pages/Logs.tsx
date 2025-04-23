import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useLogs } from '@/hooks/useApi';
import { Skeleton } from "@/components/ui/skeleton"; // Add this import

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { logs, pagination, fetchLogs, loading } = useLogs();

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]); // Recharge les logs quand la page change

  const actionLabels = {
    create: 'Création d\'un utilisateur',
    login: 'Connexion d\'un utilisateur',
    update: 'Mise à jour du rôle d\'un utilisateur',
    delete: 'Suppression d\'un utilisateur',
    generate_content: 'Génération de contenu',
    schedule_content: 'Planification de la publication de contenu',
    publish_content: 'Publication de contenu',
    cancel_publication: 'Annulation de la publication planifiée',
    generate_image: 'Génération d\'image',
    update_api_key: 'Mise à jour de clé API',
    publish_wordpress: 'Contenu publié sur WordPress',
    wordpress_oauth_connect: 'Connexion WordPress OAuth réussie', // Added label
    wordpress_oauth_disconnect: 'Déconnexion WordPress réussie', // Added label
    change_password: 'Mot de passe modifié avec succès', // Ajout de cette ligne
    delete_account: 'Suppression de compte', // Ajout de cette ligne
    delete_own_account: 'Suppression de son propre compte', // Ajout de cette ligne
    twitter_publish: 'Publication sur Twitter', // Ajout de cette ligne
    twitter_oauth_connect: 'Connexion Twitter OAuth réussie', // Ajout de cette ligne
    twitter_oauth_disconnect: 'Déconnexion Twitter OAuth réussie', // Ajout de cette ligne
    publish_facebook: 'Contenu publié sur Facebook',  
    publish_linkedin: 'Contenu publié sur LinkedIn', 
    publish_instagram: 'Contenu publié sur Instagram', // Nouvelle action
    schedule_facebook: 'Planification sur Facebook', // Nouvelle action de planification
    schedule_instagram: 'Planification sur Instagram', // Nouvelle action de planification
    schedule_linkedin: 'Planification sur LinkedIn', // Nouvelle action de planification
    schedule_wordpress: 'Planification sur WordPress', // Nouvelle action de planification
    schedule_twitter: 'Planification sur Twitter', // Nouvelle action de planification
  };

  const actionColors = {
    create: 'bg-green-100 text-green-800',
    login: 'bg-blue-100 text-blue-800',
    update: 'bg-yellow-100 text-yellow-800',
    delete: 'bg-red-100 text-red-800',
    generate_content: 'bg-purple-100 text-purple-800',
    schedule_content: 'bg-indigo-100 text-indigo-800',
    publish_content: 'bg-teal-100 text-teal-800',
    cancel_publication: 'bg-orange-100 text-orange-800',
    generate_image: 'bg-pink-100 text-pink-800',
    update_api_key: 'bg-cyan-100 text-cyan-800',
    publish_wordpress: 'bg-teal-100 text-teal-800',
    wordpress_oauth_connect: 'bg-green-100 text-green-800', // Added color
    wordpress_oauth_disconnect: 'bg-red-100 text-red-800', // Added color
    change_password: 'bg-blue-100 text-blue-800', // Ajout de cette ligne
    delete_account: 'bg-red-100 text-red-800', // Ajout de cette ligne
    delete_own_account: 'bg-red-100 text-red-800', // Ajout de cette ligne
    twitter_publish: 'bg-blue-100 text-blue-800', // Ajout de cette ligne
    twitter_oauth_connect: 'bg-green-100 text-green-800', // Ajout de cette ligne
    twitter_oauth_disconnect: 'bg-red-100 text-red-800', // Ajout de cette ligne
    publish_facebook: 'bg-blue-100 text-blue-800', // Nouvelle action avec couleur bleue
    publish_linkedin: 'bg-blue-100 text-blue-800', // Nouvelle action avec couleur bleue
    publish_instagram: 'bg-pink-100 text-pink-800', // Couleur distinctive pour Instagram
    schedule_facebook: 'bg-indigo-100 text-indigo-800', // Nouvelle couleur pour la planification Facebook
    schedule_instagram: 'bg-indigo-100 text-indigo-800', // Nouvelle couleur pour la planification Instagram
    schedule_linkedin: 'bg-indigo-100 text-indigo-800', // Nouvelle couleur pour la planification LinkedIn
    schedule_wordpress: 'bg-indigo-100 text-indigo-800', // Nouvelle couleur pour la planification WordPress
    schedule_twitter: 'bg-indigo-100 text-indigo-800', // Nouvelle couleur pour la planification Twitter
  };

  const getDetails = (log) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const details = log.details;

    if (urlRegex.test(details)) {
      return details.replace(urlRegex, (url) => `<a href="${url}" target="_blank" class="text-blue-500 underline">${url}</a>`);
    }

    return details;
  };

  const filteredLogs = logs.filter(log => 
    (filter === 'all' || log.action === filter) &&
    (log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
     getDetails(log).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const LogsSkeleton = () => (
    <tbody>
      {[...Array(10)].map((_, index) => (
        <tr key={index}>
          <td className="px-4 py-2 border-b">
            <Skeleton className="h-4 w-32 mx-auto" />
          </td>
          <td className="px-4 py-2 border-b">
            <Skeleton className="h-6 w-40 mx-auto rounded-full" />
          </td>
          <td className="px-4 py-2 border-b">
            <Skeleton className="h-4 w-full" />
          </td>
          <td className="px-4 py-2 border-b">
            <Skeleton className="h-4 w-32 mx-auto" />
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        <main className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Input 
                  placeholder="Rechercher..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
                <div className="flex items-center gap-2">
                  <Button 
                    className="flex items-center gap-2"
                    onClick={fetchLogs} // Add onClick handler to refresh logs
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-24 flex items-center justify-center">
                      Action
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="create">Création d'un utilisateur</SelectItem>
                      <SelectItem value="login">Connexion d'un utilisateur</SelectItem>
                      <SelectItem value="update">Mise à jour du rôle d'un utilisateur</SelectItem>
                      <SelectItem value="delete">Suppression d'un utilisateur</SelectItem>
                      <SelectItem value="generate_content">Génération de contenu</SelectItem>
                      <SelectItem value="schedule_content">Planification de la publication de contenu</SelectItem>
                      <SelectItem value="publish_content">Publication de contenu</SelectItem>
                      <SelectItem value="cancel_publication">Annulation de la publication planifiée</SelectItem>
                      <SelectItem value="generate_image">Génération d'image</SelectItem>
                      <SelectItem value="update_api_key">Mise à jour de clé API</SelectItem>
                      <SelectItem value="publish_wordpress">Publication sur WordPress</SelectItem>
                      <SelectItem value="wordpress_oauth_connect">Connexion WordPress</SelectItem>
                      <SelectItem value="wordpress_oauth_disconnect">Déconnexion WordPress</SelectItem>
                      <SelectItem value="change_password">Changement de mot de passe</SelectItem>
                      <SelectItem value="delete_account">Suppression de compte</SelectItem> {/* Ajout de cette ligne */}
                      <SelectItem value="delete_own_account">Suppression de son propre compte</SelectItem> {/* Ajout de cette ligne */}
                      <SelectItem value="twitter_publish">Publication sur Twitter</SelectItem> {/* Ajout de cette ligne */}
                      <SelectItem value="twitter_oauth_connect">Connexion Twitter</SelectItem> {/* Ajout de cette ligne */}
                      <SelectItem value="twitter_oauth_disconnect">Déconnexion Twitter</SelectItem> {/* Ajout de cette ligne */}
                      <SelectItem value="publish_facebook">Publication sur Facebook</SelectItem> {/* Nouvelle option */}
                      <SelectItem value="publish_linkedin">Publication sur LinkedIn</SelectItem> {/* Nouvelle option */}
                      <SelectItem value="publish_instagram">Publication sur Instagram</SelectItem> {/* Nouvelle option */}
                      <SelectItem value="schedule_facebook">Planification sur Facebook</SelectItem>
                      <SelectItem value="schedule_instagram">Planification sur Instagram</SelectItem>
                      <SelectItem value="schedule_linkedin">Planification sur LinkedIn</SelectItem>
                      <SelectItem value="schedule_wordpress">Planification sur WordPress</SelectItem>
                      <SelectItem value="schedule_twitter">Planification sur Twitter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="w-1/6 px-4 py-2 border-b">Utilisateur</th>
                    <th className="w-1/6 px-4 py-2 border-b">Action</th>
                    <th className="w-1/2 px-4 py-2 border-b">Détails</th>
                    <th className="w-1/6 px-4 py-2 border-b">Date</th>
                  </tr>
                </thead>
                {loading.fetch ? (
                  <LogsSkeleton />
                ) : (
                  <tbody>
                    {filteredLogs.map(log => (
                      <tr key={log.id}>
                        <td className="px-4 py-2 border-b text-center">{log.email}</td>
                        <td className="px-4 py-2 border-b text-center">
                          <Badge className={`${actionColors[log.action]} whitespace-nowrap`}>
                            {actionLabels[log.action]}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 border-b">
                          <div dangerouslySetInnerHTML={{ __html: getDetails(log) }} />
                        </td>
                        <td className="px-4 py-2 border-b text-center">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
              {/* Pagination UI */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Page <span className="font-medium">{pagination?.page || 1}</span> sur{' '}
                  <span className="font-medium">{pagination?.totalPages || 1}</span> |{' '}
                  Total : <span className="font-medium">{pagination?.totalLogs || 0}</span> logs
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousPage}
                    disabled={!pagination?.hasPreviousPage || loading.fetch}
                  >
                    Précédent
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={!pagination?.hasNextPage || loading.fetch}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Logs;
