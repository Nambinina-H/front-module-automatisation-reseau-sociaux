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
import { useConfig, useAuth, useWordPressAuth } from '@/hooks/useApi';
import { useSearchParams } from "react-router-dom"; // Import pour gérer les paramètres d'URL
import { apiService } from '@/services/apiService';

const Settings = () => {
  const [email, setEmail] = useState('');
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [disconnectingPlatform, setDisconnectingPlatform] = useState<string | null>(null);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showSupabaseKey, setShowSupabaseKey] = useState(false);
  const [showSupabaseServiceRoleKey, setShowSupabaseServiceRoleKey] = useState(false);
  const { appRole, userId } = useAuth(); // Récupérer le rôle de l'utilisateur et userId
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
  const [wordpressClientFields, setWordpressClientFields] = useState({
    blogUrl: '',
    blogId: '',
  });

  const [showConfirmation, setShowConfirmation] = useState(false); // State to toggle confirmation dialog
  const [currentForm, setCurrentForm] = useState<string | null>(null); // Track which form is being submitted

  const { configs, updateConfig, fetchConfigs } = useConfig();

  // Effet pour remplir les champs avec les données récupérées
  useEffect(() => {
    const wordPressConfig = configs.find(c => c.platform === 'wordPress');
    const openAIConfig = configs.find(c => c.platform === 'openai');
    const supabaseConfig = configs.find(c => c.platform === 'supabase');
    const makeConfig = configs.find(c => c.platform === 'make');
    const wordPressClientConfig = configs.find(c => c.platform === 'wordPressClient' && c.user_id === userId);

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

    if (wordPressClientConfig?.keys) {
      setWordpressClientFields({
        blogUrl: wordPressClientConfig.keys.blog_url || '',
        blogId: wordPressClientConfig.keys.blog_id || '',
      });
      console.log('WordPress Client Config:', wordPressClientConfig); // Debugging
    }
  }, [configs, userId]);

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

  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "account"; // Lire le paramètre "tab" de l'URL
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab); // Mettre à jour l'onglet actif si le paramètre change
  }, [defaultTab]);

  const { generateAuthUrl, loading: authLoading } = useWordPressAuth();

  const handleWordPressConnect = async () => {
    const { clientId, redirectUri } = wordpressFields;

    try {
      const authorizationUrl = await generateAuthUrl({ clientId, redirectUri });
      const authWindow = window.open(authorizationUrl, "_blank", "width=600,height=700");

      if (!authWindow) {
        setErrorMessage("Impossible d'ouvrir la fenêtre d'autorisation.");
        return;
      }

      let isCodeSent = false;
      const interval = setInterval(async () => {
        try {
          if (!authWindow || authWindow.closed) {
            clearInterval(interval);
            console.log("Fenêtre fermée par l'utilisateur.");
            return;
          }

          const currentUrl = authWindow.location.href;

          if (currentUrl.includes("code=") && !isCodeSent) {
            isCodeSent = true;
            clearInterval(interval);
            
            const urlParams = new URLSearchParams(new URL(currentUrl).search);
            const code = urlParams.get("code");

            if (code) {
              console.log("Code reçu :", code);
              try {
                const response = await apiService.sendWordPressCode(code);
                console.log("Réponse de l'API :", response);
              } catch (error) {
                console.error("Erreur lors de l'envoi du code :", error);
                setErrorMessage(error.response?.data?.error || "Erreur lors de la connexion à WordPress");
              } finally {
                authWindow.close();
              }
            }
          }

          if (currentUrl.includes("error=access_denied")) {
            clearInterval(interval);
            authWindow.close();
            setErrorMessage("Connexion refusée par l'utilisateur.");
          }
        } catch (error) {
          // Ignorer les erreurs de cross-origin jusqu'à ce que l'URL soit accessible
        }
      }, 1000);
    } catch (error) {
      setErrorMessage(error.message || "Une erreur est survenue.");
    }
  };

  // Ajouter l'état pour WordPress
  const [isWordPressConnected, setIsWordPressConnected] = useState(false);
  
  // Effet pour vérifier si WordPress est connecté en vérifiant les configs
  useEffect(() => {
    const wordPressConfig = configs.find(c => c.platform === 'wordPress');
    setIsWordPressConnected(!!wordPressConfig?.keys?.accessToken);
  }, [configs]);

  // Fonction pour déconnecter WordPress
  const handleWordPressDisconnect = async () => {
    try {
      await apiService.disconnectWordPress();
      setIsWordPressConnected(false);
      if (fetchConfigs) {
        await fetchConfigs(); // Recharger les configs après déconnexion
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className={`grid w-full max-w-3xl mx-auto grid-cols-${isAdmin ? 3 : 2}`}>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="hidden md:inline">Compte</span>
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
                        <h3 className="text-lg font-medium mb-2">WordPress Client</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Connectez-vous avec votre compte WordPress Client pour publier automatiquement.
                        </p>
                        {wordpressClientFields.blogUrl && wordpressClientFields.blogId ? (
                          <div className="space-y-2">
                            <p><strong>Blog URL:</strong> {wordpressClientFields.blogUrl}</p>
                            <p><strong>Blog ID:</strong> {wordpressClientFields.blogId}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-red-500">Aucune configuration trouvée.</p>
                        )}
                        <Button 
                          variant="outline" 
                          onClick={isWordPressConnected ? handleWordPressDisconnect : handleWordPressConnect} 
                          disabled={authLoading}
                        >
                          <PlatformIcon platform="wordpress" size={24} className="mr-2" />
                          {authLoading ? "Chargement..." : isWordPressConnected ? "Se déconnecter" : "Connecter"}
                        </Button>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">WordPress</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Connectez-vous avec votre compte WordPress pour publier automatiquement.
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={isWordPressConnected ? handleWordPressDisconnect : handleWordPressConnect} 
                          disabled={authLoading}
                        >
                          <PlatformIcon platform="wordpress" size={24} className="mr-2" />
                          {authLoading ? "Chargement..." : isWordPressConnected ? "Se déconnecter" : "Connecter"}
                        </Button>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">Autres plateformes via Make.com</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Intégrez vos réseaux sociaux via des webhooks Make.com.
                        </p>
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
              <Button>Soumettre</Button>
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
              <Button variant="destructive">Confirmer</Button>
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
