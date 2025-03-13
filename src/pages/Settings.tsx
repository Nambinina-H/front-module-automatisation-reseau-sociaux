
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Bell, Lock, Globe, Wordpress } from 'lucide-react';
import PlatformIcon from '@/components/common/PlatformIcon';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Paramètres</h1>
          </div>
          
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-2 lg:grid-cols-3">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="hidden md:inline">Compte</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden md:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="connections" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline">Connexions</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres du compte</CardTitle>
                  <CardDescription>
                    Gérez les paramètres de votre compte et vos préférences de sécurité
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Changer de mot de passe</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mot de passe actuel</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nouveau mot de passe</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirmer le nouveau mot de passe</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <Button>Mettre à jour le mot de passe</Button>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    <h3 className="font-medium text-red-600">Zone de danger</h3>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium">Supprimer mon compte</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Cette action est irréversible et supprimera toutes vos données.
                      </p>
                      <Button variant="destructive">Supprimer mon compte</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notifications</CardTitle>
                  <CardDescription>
                    Configurez les notifications que vous souhaitez recevoir
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { id: 'post-published', label: 'Publication de post', description: 'Recevoir une notification lorsqu\'un post est publié' },
                    { id: 'post-scheduled', label: 'Planification de post', description: 'Recevoir une notification lorsqu\'un post est planifié' },
                    { id: 'platform-updates', label: 'Mises à jour de la plateforme', description: 'Recevoir des notifications concernant les mises à jour de la plateforme' },
                  ].map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <p className="font-medium">{notification.label}</p>
                        <p className="text-sm text-gray-500">{notification.description}</p>
                      </div>
                      <Switch defaultChecked={['post-published', 'post-scheduled'].includes(notification.id)} />
                    </div>
                  ))}
                  
                  <div className="space-y-2 pt-4">
                    <h3 className="font-medium">Méthodes de notification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <p>Email</p>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Notifications dans l'application</p>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="connections">
              <Card>
                <CardHeader>
                  <CardTitle>Connexions aux réseaux sociaux</CardTitle>
                  <CardDescription>
                    Connectez vos comptes de réseaux sociaux pour automatiser vos publications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { platform: 'linkedin', name: 'LinkedIn', connected: true },
                    { platform: 'instagram', name: 'Instagram', connected: true },
                    { platform: 'twitter', name: 'Twitter', connected: false },
                    { platform: 'facebook', name: 'Facebook', connected: true },
                    { platform: 'wordpress', name: 'WordPress', connected: false },
                  ].map((connection) => (
                    <div key={connection.platform} className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div className="flex items-center space-x-3">
                        <PlatformIcon platform={connection.platform as any} size={24} />
                        <div>
                          <p className="font-medium">{connection.name}</p>
                          <p className="text-sm text-gray-500">
                            {connection.connected ? 'Connecté' : 'Non connecté'}
                          </p>
                        </div>
                      </div>
                      <Button variant={connection.connected ? 'outline' : 'default'}>
                        {connection.connected ? 'Déconnecter' : 'Connecter'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
