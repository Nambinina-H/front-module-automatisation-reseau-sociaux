import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';

interface VideoTestProps {
  videoUrl: string;
  simplified?: boolean;
}

const VideoTest: React.FC<VideoTestProps> = ({ videoUrl, simplified = true }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Réinitialiser l'état lorsque l'URL change
  useEffect(() => {
    setBlobUrl(null);
    setError(null);
  }, [videoUrl]);

  // Fonction pour créer un URL blob à partir de l'URL distante
  const createBlobUrl = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Afficher l'URL reçue pour débogage
      console.log('Tentative de téléchargement de la vidéo depuis:', videoUrl);
      
      const response = await fetch(videoUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'video/mp4,video/*;q=0.8,*/*;q=0.5',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      
      console.log('Blob URL created:', url);
    } catch (err) {
      console.error('Error creating blob URL:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Nettoyage de l'URL blob à la sortie
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  // Version simplifiée pour l'intégration directe dans ContentGeneration
  if (simplified) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Vidéo générée</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <HelpCircle className="h-4 w-4 text-gray-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <p className="text-sm text-gray-600">
                  Si la vidéo ne s'affiche pas, essayez l'onglet "URL Blob"
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          {/* Ajout du bloc d'affichage de l'URL avant les onglets */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md mb-4">
            <div className="flex-1 overflow-hidden">
              <p className="text-sm text-gray-500 mb-1">URL de la vidéo:</p>
              <p className="text-sm font-mono truncate">{videoUrl}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(videoUrl)
                  .then(() => toast?.success?.("URL copiée dans le presse-papiers") || alert("URL copiée dans le presse-papiers"))
                  .catch(() => toast?.error?.("Impossible de copier l'URL") || alert("Impossible de copier l'URL"));
              }}
            >
              Copier
            </Button>
          </div>
          
          <Tabs defaultValue="direct" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="direct">URL directe</TabsTrigger>
              <TabsTrigger value="blob">URL Blob</TabsTrigger>
            </TabsList>
            
            <TabsContent value="direct">
              <div className="relative w-full pt-[56.25%] bg-gray-100 rounded-md overflow-hidden">
                <video 
                  src={videoUrl}
                  className="absolute inset-0 w-full h-full"
                  controls
                  autoPlay={false}
                  poster="/video-placeholder.png"
                  onError={(e) => {
                    console.error("Erreur lors du chargement de la vidéo (URL directe):", e);
                  }}
                  onLoadedData={() => {
                    console.log("Vidéo chargée avec succès (URL directe)");
                  }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="blob">
              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
                  Erreur: {error}
                </div>
              )}
              
              {!blobUrl && !isLoading && (
                <div className="p-4 text-center">
                  <Button 
                    onClick={createBlobUrl} 
                    disabled={isLoading || !videoUrl}
                    className="mb-4"
                  >
                    {isLoading ? 'Chargement...' : 'Créer une URL Blob depuis l\'URL'}
                  </Button>
                  <p className="text-sm text-gray-500">
                    Cette méthode télécharge d'abord la vidéo puis la lit localement
                  </p>
                </div>
              )}
              
              {isLoading ? (
                <div className="w-full pt-[56.25%] bg-gray-100 rounded-md relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    Chargement de la vidéo...
                  </div>
                </div>
              ) : blobUrl ? (
                <div className="relative w-full pt-[56.25%] bg-gray-100 rounded-md overflow-hidden">
                  <video 
                    src={blobUrl}
                    className="absolute inset-0 w-full h-full"
                    controls
                    autoPlay={false}
                    onError={(e) => {
                      console.error("Erreur lors du chargement de la vidéo (URL Blob):", e);
                    }}
                    onLoadedData={() => {
                      console.log("Vidéo chargée avec succès (URL Blob)");
                    }}
                  />
                </div>
              ) : null}
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <div className="grid grid-cols-1">
              <Button 
                variant="outline"
                onClick={async () => {
                  try {
                    const response = await fetch(videoUrl);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'video.mp4';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error('Erreur lors du téléchargement:', error);
                    alert('Erreur lors du téléchargement: ' + error);
                  }
                }}
                className="w-full"
              >
                Télécharger la vidéo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Version complète avec tous les contrôles (version d'origine non utilisée dans ContentGeneration)
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        
        <main className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Test d'affichage vidéo</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>URL de la vidéo</CardTitle>
              <CardDescription>Modifiez l'URL pour tester différentes vidéos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="videoUrl">URL de la vidéo</Label>
                  <Input 
                    id="videoUrl" 
                    value={videoUrl} 
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <Button 
                  onClick={createBlobUrl} 
                  disabled={isLoading || !videoUrl}
                >
                  {isLoading ? 'Chargement...' : 'Créer une URL Blob depuis l\'URL'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="direct" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="direct">URL directe</TabsTrigger>
              <TabsTrigger value="blob">URL Blob</TabsTrigger>
            </TabsList>
            
            <TabsContent value="direct">
              <Card>
                <CardHeader>
                  <CardTitle>Lecture directe depuis l'URL</CardTitle>
                  <CardDescription>Utilisation de l'URL d'origine directement dans la balise video</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full pt-[56.25%] bg-gray-100 rounded-md overflow-hidden">
                    <video 
                      src={videoUrl}
                      className="absolute inset-0 w-full h-full"
                      controls
                      autoPlay={false}
                      poster="/video-placeholder.png"
                      onError={(e) => {
                        console.error("Erreur lors du chargement de la vidéo (URL directe):", e);
                      }}
                      onLoadedData={() => {
                        console.log("Vidéo chargée avec succès (URL directe)");
                      }}
                    />
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium">Journal de débogage:</p>
                    <div className="bg-gray-100 p-2 rounded-md mt-1 text-xs font-mono">
                      <p>URL vidéo: {videoUrl}</p>
                      <p>Note: Vérifiez la console du navigateur pour voir les messages d'erreur potentiels.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="blob">
              <Card>
                <CardHeader>
                  <CardTitle>Lecture via URL Blob</CardTitle>
                  <CardDescription>La vidéo est d'abord téléchargée puis lue localement</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
                      Erreur: {error}
                    </div>
                  )}
                  
                  {isLoading ? (
                    <div className="w-full pt-[56.25%] bg-gray-100 rounded-md relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        Chargement de la vidéo...
                      </div>
                    </div>
                  ) : blobUrl ? (
                    <div className="relative w-full pt-[56.25%] bg-gray-100 rounded-md overflow-hidden">
                      <video 
                        src={blobUrl}
                        className="absolute inset-0 w-full h-full"
                        controls
                        autoPlay={false}
                        onError={(e) => {
                          console.error("Erreur lors du chargement de la vidéo (URL Blob):", e);
                        }}
                        onLoadedData={() => {
                          console.log("Vidéo chargée avec succès (URL Blob)");
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full pt-[56.25%] bg-gray-100 rounded-md flex items-center justify-center relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-500">Cliquez sur "Créer une URL Blob depuis l'URL" pour tester cette méthode</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Button 
                      onClick={createBlobUrl} 
                      disabled={isLoading || !videoUrl}
                      className="w-full mb-4"
                    >
                      {isLoading ? 'Chargement...' : 'Créer une URL Blob depuis l\'URL'}
                    </Button>
                    
                    <p className="text-sm font-medium">Journal de débogage:</p>
                    <div className="bg-gray-100 p-2 rounded-md mt-1 text-xs font-mono">
                      <p>URL d'origine: {videoUrl}</p>
                      <p>URL Blob: {blobUrl || "Non générée"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">Options:</h2>
            <div className="grid grid-cols-1">
              <Button 
                variant="outline"
                onClick={async () => {
                  try {
                    const response = await fetch(videoUrl);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'video.mp4';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error('Erreur lors du téléchargement:', error);
                    alert('Erreur lors du téléchargement: ' + error);
                  }
                }}
                className="w-full"
              >
                Télécharger la vidéo
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VideoTest;
