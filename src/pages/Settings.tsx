
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Settings as SettingsIcon, User, Bell, Shield, Lock, Globe, CreditCard } from 'lucide-react';
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
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Profil</span>
              </TabsTrigger>
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
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden md:inline">Facturation</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden md:inline">Sécurité</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profil</CardTitle>
                  <CardDescription>
                    Gérez les informations de votre profil et vos préférences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-medium text-gray-600">
                          UN
                        </div>
                        <Button variant="outline" size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0">
                          <SettingsIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Prénom</label>
                        <Input placeholder="Votre prénom" defaultValue="Utilisateur" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nom</label>
                        <Input placeholder="Votre nom" defaultValue="Nom" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input placeholder="Votre email" defaultValue="utilisateur@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea placeholder="Votre biographie" defaultValue="Gestionnaire de médias sociaux avec 5 ans d'expérience." className="min-h-32" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Langue</label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Enregistrer les modifications</Button>
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
                    { id: 'post-engagement', label: 'Engagement sur les posts', description: 'Recevoir une notification lorsqu\'un post reçoit un engagement significatif' },
                    { id: 'analytics-weekly', label: 'Rapport analytique hebdomadaire', description: 'Recevoir un rapport hebdomadaire de vos performances' },
                    { id: 'platform-updates', label: 'Mises à jour de la plateforme', description: 'Recevoir des notifications concernant les mises à jour de la plateforme' },
                  ].map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <p className="font-medium">{notification.label}</p>
                        <p className="text-sm text-gray-500">{notification.description}</p>
                      </div>
                      <Switch defaultChecked={['post-published', 'post-scheduled', 'analytics-weekly'].includes(notification.id)} />
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
                    <h3 className="font-medium">Session active</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Chrome sur MacBook Pro</p>
                          <p className="text-sm text-gray-500">Paris, France · Aujourd'hui à 14:30</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Actif
                        </span>
                      </div>
                    </div>
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
            
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Facturation</CardTitle>
                  <CardDescription>
                    Gérez vos préférences de facturation et votre abonnement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                    <h3 className="font-medium text-xl">Plan Business</h3>
                    <p className="text-sm text-gray-500 mb-4">Facturé annuellement</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">29€</span>
                      <span className="text-gray-500 ml-1">/mois</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Prochain renouvellement le 15/12/2023</p>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline">Changer de plan</Button>
                      <Button variant="destructive">Annuler l'abonnement</Button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    <h3 className="font-medium">Méthode de paiement</h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-gray-100 w-10 h-6 rounded mr-3 flex items-center justify-center text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium">Visa se terminant par 4242</p>
                          <p className="text-sm text-gray-500">Expire le 12/2025</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Modifier</Button>
                    </div>
                    <Button variant="outline">Ajouter une méthode de paiement</Button>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    <h3 className="font-medium">Historique de facturation</h3>
                    <div className="space-y-2">
                      {[
                        { date: '01/11/2023', amount: '29,00 €', status: 'Payé' },
                        { date: '01/10/2023', amount: '29,00 €', status: 'Payé' },
                        { date: '01/09/2023', amount: '29,00 €', status: 'Payé' },
                      ].map((invoice, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                          <div>
                            <p className="font-medium">{invoice.date}</p>
                            <p className="text-sm text-gray-500">{invoice.amount}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              {invoice.status}
                            </span>
                            <Button variant="ghost" size="sm">Télécharger</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>
                    Configurez vos paramètres de sécurité et de confidentialité
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Authentification à deux facteurs</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Activer l'authentification à deux facteurs</p>
                        <p className="text-sm text-gray-500">
                          Ajoutez une couche de sécurité supplémentaire à votre compte
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    <h3 className="font-medium">Connexions aux applications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                        <div>
                          <p className="font-medium">Google Calendar</p>
                          <p className="text-sm text-gray-500">
                            Accès au calendrier pour la planification
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Révoquer</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                        <div>
                          <p className="font-medium">Buffer</p>
                          <p className="text-sm text-gray-500">
                            Accès aux publications sur les réseaux sociaux
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Révoquer</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    <h3 className="font-medium">Confidentialité des données</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Collecte des données d'analyse</p>
                          <p className="text-sm text-gray-500">
                            Nous utilisons ces données pour améliorer le service
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Partage des données avec des tiers</p>
                          <p className="text-sm text-gray-500">
                            Contrôlez quelles données sont partagées avec des tiers
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
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
