import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Lock, Globe, FileCode, Eye, EyeOff } from 'lucide-react';
import PlatformIcon from '@/components/common/PlatformIcon';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useConfig, useAuth } from '@/hooks/useApi';

const Settings = () => {
  const [email, setEmail] = useState('');
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [disconnectingPlatform, setDisconnectingPlatform] = useState<string | null>(null);
  const [urlWebhook, setUrlWebhook] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showKeys, setShowKeys] = useState(false); // State to toggle key visibility
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showSupabaseKey, setShowSupabaseKey] = useState(false);
  const [showSupabaseServiceRoleKey, setShowSupabaseServiceRoleKey] = useState(false);
  const { appRole } = useAuth(); // Récupérer le rôle de l'utilisateur
  const isAdmin = appRole === 'admin'; // Vérifier si l'utilisateur est admin

  const [wordpressFields, setWordpressFields] = useState({ 
    clientId: '', 
    clientSecret: '',
    redirectUri: ''  // Ajout de redirectUri dans le state
  });
  const [openAIFields, setOpenAIFields] = useState({ apiKey: '' });
  const [supabaseFields, setSupabaseFields] = useState({ url: '', key: '', serviceRoleKey: '' });
  const [makeWebhooksFields, setMakeWebhooksFields] = useState({
    facebook: '',
    linkedin: '',
    instagram: '',
    twitter: '',
  });

  const isWordpressFormValid = wordpressFields.clientId && wordpressFields.clientSecret;
  const isOpenAIFormValid = openAIFields.apiKey;
  const isSupabaseFormValid = supabaseFields.url && supabaseFields.key && supabaseFields.serviceRoleKey;
  const isMakeWebhooksFormValid =
    makeWebhooksFields.facebook &&
    makeWebhooksFields.linkedin &&
    makeWebhooksFields.instagram &&
    makeWebhooksFields.twitter;

  const handleConnect = (platform: string) => {
    setConnectingPlatform(platform);
    setErrorMessage('');
  };

  const handleDisconnect = (platform: string) => {
    setDisconnectingPlatform(platform);
  };

  const handleSubmitConnection = () => {
    // Implement the connection logic here
    // On success:
    setConnectingPlatform(null);
    // On error:
    // setErrorMessage('Connection failed. Please check your URL webhook.');
  };

  const handleConfirmDisconnection = () => {
    // Implement the disconnection logic here
    setDisconnectingPlatform(null);
  };

  const [showConfirmation, setShowConfirmation] = useState(false); // State to toggle confirmation dialog
  const [currentForm, setCurrentForm] = useState<string | null>(null); // Track which form is being submitted

  const { configs, updateConfig, loading: configLoading, fetchConfigs } = useConfig();

  // Effet pour remplir les champs avec les données récupérées
  useEffect(() => {
    const wordPressConfig = configs.find(c => c.platform === 'wordPress');
    const openAIConfig = configs.find(c => c.platform === 'openai');
    const supabaseConfig = configs.find(c => c.platform === 'supabase');
    const makeConfig = configs.find(c => c.platform === 'make');

    if (wordPressConfig?.keys) {
      setWordpressFields({
        clientId: wordPressConfig.keys.clientId || '',
        clientSecret: wordPressConfig.keys.clientSecret || '',
        redirectUri: wordPressConfig.keys.redirectUri || ''  // Récupération de redirectUri
      });
    }

    if (openAIConfig?.keys) {
      setOpenAIFields({
        apiKey: openAIConfig.keys.apiKey || '',
      });
    }

    if (supabaseConfig?.keys) {
      setSupabaseFields({
        url: supabaseConfig.keys.url || '',
        key: supabaseConfig.keys.key || '',
        serviceRoleKey: supabaseConfig.keys.serviceRoleKey || '',
      });
    }

    if (makeConfig?.keys) {
      setMakeWebhooksFields({
        facebook: makeConfig.keys.facebook || '',
        linkedin: makeConfig.keys.linkedin || '',
        instagram: makeConfig.keys.instagram || '',
        twitter: makeConfig.keys.twitter || '',
      });
    }
  }, [configs]);

  const handleFormSubmit = (formName: string) => {
    setCurrentForm(formName);
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    if (!currentForm) return;
    
    const config = configs.find(c => {
      switch (currentForm) {
        case 'WordPress': return c.platform === 'wordPress';
        case 'OpenAI API': return c.platform === 'openai';
        case 'Supabase': return c.platform === 'supabase';
        case 'Make Webhooks': return c.platform === 'make';
        default: return false;
      }
    });

    if (!config) return;

    let keys: ConfigKeys = {};
    switch (currentForm) {
      case 'WordPress':
        keys = {
          clientId: wordpressFields.clientId,
          clientSecret: wordpressFields.clientSecret,
          redirectUri: wordpressFields.redirectUri
        };
        break;
      case 'OpenAI API':
        keys = {
          apiKey: openAIFields.apiKey,
        };
        break;
      case 'Supabase':
        keys = {
          url: supabaseFields.url,
          key: supabaseFields.key,
          serviceRoleKey: supabaseFields.serviceRoleKey,
        };
        break;
      case 'Make Webhooks':
        keys = {
          facebook: makeWebhooksFields.facebook,
          linkedin: makeWebhooksFields.linkedin,
          instagram: makeWebhooksFields.instagram,
          twitter: makeWebhooksFields.twitter,
        };
        break;
    }

    try {
      await updateConfig(config.id, keys);
      setShowConfirmation(false);
      setCurrentForm(null);
      
      // Forcer un rechargement des configurations après la mise à jour
      if (fetchConfigs) {
        await fetchConfigs();
      }
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
    setCurrentForm(null);
  };

  // Event handler for Dialog onOpenChange
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      handleCancelSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Paramètres</h1>
          </div>
          
          <Tabs defaultValue={isAdmin ? "account" : "account"} className="space-y-6">
            <TabsList className={`grid w-full max-w-3xl mx-auto grid-cols-${isAdmin ? 4 : 3}`}>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="hidden md:inline">Compte</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden md:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline">Intégrations</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="developer" className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  <span className="hidden md:inline">Développeur</span>
                </TabsTrigger>
              )}
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive">Supprimer mon compte</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmation suppression de compte</DialogTitle>
                            <DialogDescription>
                              Cette action ne peut pas être annulée. Pour confirmer, veuillez entrer votre email.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Label htmlFor="email">Tapez "email" pour confirmer </Label>
                            <Input 
                              id="email" 
                              type="email" 
                              placeholder="Your email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Annuler</Button>
                            </DialogClose>
                            <Button variant="destructive">Supprimer</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
                      <Switch />
                    </div>
                  ))}
                  
                  <div className="space-y-2 pt-4">
                    <h3 className="font-medium">Méthodes de notification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <p>Email</p>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Notifications dans l'application</p>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle>Intégrations avec les réseaux sociaux</CardTitle>
                  <CardDescription>
                    Connectez vos comptes de réseaux sociaux pour automatiser vos publications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-6">
                      <div className="border rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">WordPress</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Connectez-vous avec votre compte WordPress pour publier automatiquement.
                        </p>
                        <Button variant="outline">
                          <PlatformIcon platform="wordpress" size={24} className="mr-2" />
                          Se connecter avec WordPress
                        </Button>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">Autres plateformes via Make.com</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Intégrez vos réseaux sociaux via des webhooks Make.com.
                        </p>
                        <div className="space-y-4">
                          {[
                            { platform: 'linkedin', name: 'LinkedIn', connected: true },
                            { platform: 'instagram', name: 'Instagram', connected: true },
                            { platform: 'twitter', name: 'Twitter', connected: true },
                            { platform: 'facebook', name: 'Facebook', connected: true },
                          ].map((connection) => (
                            <div key={connection.platform} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <PlatformIcon platform={connection.platform} size={24} />
                                <div>
                                  <p className="font-medium">{connection.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {connection.connected ? 'Webhook configuré' : 'Non configuré'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="developer">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration des API</CardTitle>
                    <CardDescription>
                      Gérez les identifiants OAuth2 et les clés API pour les différentes plateformes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        { id: 'wordpress', name: 'WordPress', clientId: '', clientSecret: '', redirectUri: 'https://example.com/callback' },
                      ].map((platform) => (
                        <div key={platform.id} className="border rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-4">{platform.name}</h3>
                          <form
                            className="space-y-4"
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleFormSubmit("WordPress");
                            }}
                          >
                            <div className="space-y-2">
                              <Label>Client ID</Label>
                              <Input
                                type="text"
                                placeholder={`${platform.name} Client ID`}
                                value={wordpressFields.clientId}
                                onChange={(e) =>
                                  setWordpressFields({ ...wordpressFields, clientId: e.target.value })
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Client Secret</Label>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type={showClientSecret ? "text" : "password"}
                                  placeholder={`${platform.name} Client Secret`}
                                  value={wordpressFields.clientSecret}
                                  onChange={(e) =>
                                    setWordpressFields({ ...wordpressFields, clientSecret: e.target.value })
                                  }
                                  required
                                />
                                <Button
                                  type="button" // Prevent form submission
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setShowClientSecret(!showClientSecret)}
                                >
                                  {showClientSecret ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Redirect URI</Label>
                              <Input
                                type="text"
                                placeholder="Votre Redirect URI"
                                value={wordpressFields.redirectUri}
                                onChange={(e) =>
                                  setWordpressFields({ 
                                    ...wordpressFields, 
                                    redirectUri: e.target.value 
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="flex justify-end">
                              <Button type="submit">Modifier</Button>
                            </div>
                          </form>
                        </div>
                      ))}
                      {/* Add OPENAI_API_KEY Section */}
                      <div className="border rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-4">OpenAI API</h3>
                        <form
                          className="space-y-4"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleFormSubmit("OpenAI API");
                          }}
                        >
                          <div className="space-y-2">
                            <Label>OPENAI_API_KEY</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                type={showOpenAIKey ? "text" : "password"}
                                placeholder="Votre clé API OpenAI"
                                value={openAIFields.apiKey}
                                onChange={(e) =>
                                  setOpenAIFields({ ...openAIFields, apiKey: e.target.value })
                                }
                                required
                              />
                              <Button
                                type="button" // Prevent form submission
                                variant="outline"
                                size="icon"
                                onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                              >
                                {showOpenAIKey ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button type="submit">Modifier</Button>
                          </div>
                        </form>
                      </div>
                      {/* Group Supabase Configurations */}
                      <div className="border rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-4">Supabase</h3>
                        <form
                          className="space-y-4"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleFormSubmit("Supabase");
                          }}
                        >
                          <div className="space-y-2">
                            <Label>SUPABASE_URL</Label>
                            <Input
                              type="text"
                              placeholder="Votre URL Supabase"
                              value={supabaseFields.url}
                              onChange={(e) =>
                                setSupabaseFields({ ...supabaseFields, url: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>SUPABASE_KEY</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                type={showSupabaseKey ? "text" : "password"}
                                placeholder="Votre clé Supabase"
                                value={supabaseFields.key}
                                onChange={(e) =>
                                  setSupabaseFields({ ...supabaseFields, key: e.target.value })
                                }
                                required
                              />
                              <Button
                                type="button" // Prevent form submission
                                variant="outline"
                                size="icon"
                                onClick={() => setShowSupabaseKey(!showSupabaseKey)}
                              >
                                {showSupabaseKey ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>SUPABASE_SERVICE_ROLE_KEY</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                type={showSupabaseServiceRoleKey ? "text" : "password"}
                                placeholder="Votre clé de rôle de service Supabase"
                                value={supabaseFields.serviceRoleKey}
                                onChange={(e) =>
                                  setSupabaseFields({
                                    ...supabaseFields,
                                    serviceRoleKey: e.target.value,
                                  })
                                }
                                required
                              />
                              <Button
                                type="button" // Prevent form submission
                                variant="outline"
                                size="icon"
                                onClick={() => setShowSupabaseServiceRoleKey(!showSupabaseServiceRoleKey)}
                              >
                                {showSupabaseServiceRoleKey ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button type="submit">Modifier</Button>
                          </div>
                        </form>
                      </div>
                      {/* Add Make Webhooks Section */}
                      <div className="border rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-4">Make Webhooks</h3>
                        <form
                          className="space-y-4"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleFormSubmit("Make Webhooks");
                          }}
                        >
                          <div className="space-y-2">
                            <Label>MAKE_WEBHOOK_FACEBOOK</Label>
                            <Input
                              type="text"
                              placeholder="Webhook URL pour Facebook"
                              value={makeWebhooksFields.facebook}
                              onChange={(e) =>
                                setMakeWebhooksFields({
                                  ...makeWebhooksFields,
                                  facebook: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>MAKE_WEBHOOK_LINKEDIN</Label>
                            <Input
                              type="text"
                              placeholder="Webhook URL pour LinkedIn"
                              value={makeWebhooksFields.linkedin}
                              onChange={(e) =>
                                setMakeWebhooksFields({
                                  ...makeWebhooksFields,
                                  linkedin: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>MAKE_WEBHOOK_INSTAGRAM</Label>
                            <Input
                              type="text"
                              placeholder="Webhook URL pour Instagram"
                              value={makeWebhooksFields.instagram}
                              onChange={(e) =>
                                setMakeWebhooksFields({
                                  ...makeWebhooksFields,
                                  instagram: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>MAKE_WEBHOOK_TWITTER</Label>
                            <Input
                              type="text"
                              placeholder="Webhook URL pour Twitter"
                              value={makeWebhooksFields.twitter}
                              onChange={(e) =>
                                setMakeWebhooksFields({
                                  ...makeWebhooksFields,
                                  twitter: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="flex justify-end">
                            <Button type="submit">Modifier</Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </main>
      </div>

      {connectingPlatform && (
        <Dialog open={!!connectingPlatform} onOpenChange={() => setConnectingPlatform(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connecter à {connectingPlatform}</DialogTitle>
              <DialogDescription>
                Entrez les informations nécessaires pour connecter votre compte {connectingPlatform}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="clientId">Client ID</Label>
              <Input 
                id="clientId" 
                type="text" 
                placeholder="Votre Client ID" 
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
              <br />
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input 
                id="clientSecret" 
                type="text" 
                placeholder="Votre Client Secret" 
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
              />
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleSubmitConnection}>Soumettre</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {disconnectingPlatform && (
        <Dialog open={!!disconnectingPlatform} onOpenChange={() => setDisconnectingPlatform(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Déconnecter de {disconnectingPlatform}</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir déconnecter votre compte {disconnectingPlatform} ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleConfirmDisconnection}>Confirmer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <Dialog 
          open={showConfirmation} 
          onOpenChange={handleDialogOpenChange}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmation</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir enregistrer les modifications pour {currentForm} ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelSubmit}>
                Annuler
              </Button>
              <Button onClick={handleConfirmSubmit}>Confirmer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Settings;
