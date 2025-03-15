import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const logs = [
    { id: 1, utilisateur: 'john.doe@example.com', action: 'create', details: 'Création d\'un utilisateur', level: 'info', date: '2023-10-01' },
    { id: 2, utilisateur: 'jane.smith@example.com', action: 'login', details: 'Connexion d\'un utilisateur', level: 'info', date: '2023-10-02' },
    { id: 3, utilisateur: 'alice.johnson@example.com', action: 'update', details: 'Mise à jour du rôle d\'un utilisateur', level: 'info', date: '2023-10-03' },
    { id: 4, utilisateur: 'bob.brown@example.com', action: 'delete', details: 'Suppression d\'un utilisateur', level: 'error', date: '2023-10-04' },
    { id: 5, utilisateur: 'charlie.davis@example.com', action: 'generate_content', details: 'Génération de contenu', level: 'info', date: '2023-10-05' },
    { id: 6, utilisateur: 'diana.evans@example.com', action: 'schedule_content', details: 'Planification de la publication de contenu', level: 'info', date: '2023-10-06' },
    { id: 7, utilisateur: 'eve.foster@example.com', action: 'publish_content', details: 'Publication de contenu', level: 'info', date: '2023-10-07' },
    { id: 8, utilisateur: 'frank.green@example.com', action: 'cancel_publication', details: 'Annulation de la publication planifiée', level: 'warning', date: '2023-10-08' },
    { id: 9, utilisateur: 'grace.harris@example.com', action: 'login', details: 'Connexion d\'un utilisateur', level: 'info', date: '2023-10-09' },
    { id: 10, utilisateur: 'henry.irving@example.com', action: 'create', details: 'Création d\'un utilisateur', level: 'info', date: '2023-10-10' },
  ];

  const actionLabels = {
    create: 'Création d\'un utilisateur',
    login: 'Connexion d\'un utilisateur',
    update: 'Mise à jour du rôle d\'un utilisateur',
    delete: 'Suppression d\'un utilisateur',
    generate_content: 'Génération de contenu',
    schedule_content: 'Planification de la publication de contenu',
    publish_content: 'Publication de contenu',
    cancel_publication: 'Annulation de la publication planifiée'
  };

  const actionColors = {
    create: 'bg-green-100 text-green-800',
    login: 'bg-blue-100 text-blue-800',
    update: 'bg-yellow-100 text-yellow-800',
    delete: 'bg-red-100 text-red-800',
    generate_content: 'bg-purple-100 text-purple-800',
    schedule_content: 'bg-indigo-100 text-indigo-800',
    publish_content: 'bg-teal-100 text-teal-800',
    cancel_publication: 'bg-orange-100 text-orange-800'
  };

  const filteredLogs = logs.filter(log => 
    (filter === 'all' || log.level === filter) &&
    (log.utilisateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.details.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        <main className="p-6">
          <div className="flex justify-between items-center mb-4">
            <Input 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filtrer par niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="error">Erreur</SelectItem>
                <SelectItem value="warning">Avertissement</SelectItem>
              </SelectContent>
            </Select>
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
                  <td className="px-4 py-2 border-b text-center">{log.utilisateur}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <Badge className={`${actionColors[log.action]} whitespace-nowrap`}>
                      {actionLabels[log.action]}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 border-b">{log.details}</td>
                  <td className="px-4 py-2 border-b text-center">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default Logs;
