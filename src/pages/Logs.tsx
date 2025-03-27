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

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const { logs, fetchLogs, loading } = useLogs();

  useEffect(() => {
    fetchLogs();
  }, []); // Fetch logs only once when the component mounts

  const actionLabels = {
    create: 'Création d\'un utilisateur',
    login: 'Connexion d\'un utilisateur',
    update: 'Mise à jour du rôle d\'un utilisateur',
    delete: 'Suppression d\'un utilisateur',
    generate_content: 'Génération de contenu',
    schedule_content: 'Planification de la publication de contenu',
    publish_content: 'Publication de contenu',
    cancel_publication: 'Annulation de la publication planifiée',
    generate_image: 'Génération d\'image'
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
    generate_image: 'bg-pink-100 text-pink-800'
  };

  const getDetails = (log) => {
    return log.details;
  };

  const filteredLogs = logs.filter(log => 
    (filter === 'all' || log.action === filter) &&
    (log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
     getDetails(log).toLowerCase().includes(searchTerm.toLowerCase()))
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
                <tbody>
                  {filteredLogs.map(log => (
                    <tr key={log.id}>
                      <td className="px-4 py-2 border-b text-center">{log.email}</td>
                      <td className="px-4 py-2 border-b text-center">
                        <Badge className={`${actionColors[log.action]} whitespace-nowrap`}>
                          {actionLabels[log.action]}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 border-b">{getDetails(log)}</td>
                      <td className="px-4 py-2 border-b text-center">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Logs;
