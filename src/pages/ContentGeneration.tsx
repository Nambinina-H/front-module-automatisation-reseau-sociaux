import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Badge from '@/components/common/Badge';
import { toast } from 'sonner';
import { 
  Image, 
  FileVideo, 
  FileText, 
  Wand2, 
  Upload, 
  Download, 
  AlertCircle, 
  HelpCircle,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useContent } from '@/hooks/useApi';
import { ContentGenerationParams, ContentPersonalization, VideoGenerationParams } from '@/services/apiService';
import Maintenance from '@/components/ui/Maintenance';

// Ajoutez l'import du nouveau hook
import { useVideoDescription } from '@/hooks/useApi';

// Ajoutez l'import du composant VideoTest
import VideoTest from '@/components/test/VideoTest';

// Ajout du nouvel import
import { useAudioDescription } from '@/hooks/useApi';

// Importation du hook pour l'ajout d'audio à la vidéo
import { useAddAudioToVideo } from '@/hooks/useApi';

// Ajout du hook pour l'extension de vidéo
import { useExtendVideo } from '@/hooks/useApi';

// Sample template data - triés alphabétiquement dans chaque catégorie
const initialTemplates = [
  // Modèles WordPress (triés alphabétiquement)
  { id: 'wordpress_article', name: 'Article WordPress', contentType: 'text' },
  { id: 'wordpress_page', name: 'Page WordPress', contentType: 'text' },
  { id: 'wordpress_product_description', name: 'Description de produit WordPress', contentType: 'text' },
  { id: 'wordpress_seo', name: 'Contenu SEO WordPress', contentType: 'text' },

  // Modèles Facebook (triés alphabétiquement)
  { id: 'facebook_ad', name: 'Annonce Facebook', contentType: 'text' },
  { id: 'facebook_event', name: 'Événement Facebook', contentType: 'text' },
  { id: 'facebook_post', name: 'Publication Facebook', contentType: 'text' },

  // Modèles Instagram (triés alphabétiquement)
  { id: 'instagram_ad', name: 'Annonce Instagram', contentType: 'text' },
  { id: 'instagram_caption', name: 'Légende Instagram', contentType: 'text' },
  { id: 'instagram_story', name: 'Story Instagram', contentType: 'text' },

  // Modèles LinkedIn (triés alphabétiquement)
  { id: 'linkedin_ad', name: 'Annonce LinkedIn', contentType: 'text' },
  { id: 'linkedin_article', name: 'Article LinkedIn', contentType: 'text' },
  { id: 'linkedin_post', name: 'Publication LinkedIn', contentType: 'text' },

  // Modèles Twitter (triés alphabétiquement)
  { id: 'twitter_ad', name: 'Annonce Twitter', contentType: 'text' },
  { id: 'twitter_thread', name: 'Thread Twitter', contentType: 'text' },
  { id: 'twitter_tweet', name: 'Tweet', contentType: 'text' },

  // Autres modèles (triés alphabétiquement)
  { id: 'blog', name: 'Article de blog', contentType: 'text' },
  { id: 'banner', name: 'Bannière sociale', contentType: 'image' },
  { id: 'case_study', name: 'Étude de cas', contentType: 'text' },
  { id: 'email_marketing', name: 'Email marketing', contentType: 'text' },
  { id: 'faq', name: 'FAQ', contentType: 'text' },
  { id: 'how_to_guide', name: 'Guide pratique', contentType: 'text' },
  { id: 'infographic', name: 'Infographie', contentType: 'image' },
  { id: 'newsletter', name: 'Newsletter', contentType: 'text' },
  { id: 'press_release', name: 'Communiqué de presse', contentType: 'text' },
  { id: 'product_review', name: 'Avis sur un produit', contentType: 'text' },
  { id: 'promo', name: 'Vidéo promotionnelle', contentType: 'video' },
  { id: 'social', name: 'Légende pour réseaux sociaux', contentType: 'text' },
  { id: 'tutorial', name: 'Tutoriel', contentType: 'video' }
];

// Initial tones - triés alphabétiquement par nom
const initialTones = [
  { id: 'authoritative', name: 'Autoritaire' },
  { id: 'calm', name: 'Calme' },
  { id: 'confident', name: 'Confiant' },
  { id: 'casual', name: 'Décontracté' },
  { id: 'empathetic', name: 'Empathique' },
  { id: 'enthusiastic', name: 'Enthousiaste' },
  { id: 'formal', name: 'Formel' },
  { id: 'friendly', name: 'Amical' },
  { id: 'humorous', name: 'Humoristique' },
  { id: 'informative', name: 'Informatif' },
  { id: 'inspirational', name: 'Inspirant' },
  { id: 'motivational', name: 'Motivant' },
  { id: 'neutral', name: 'Neutre' },
  { id: 'optimistic', name: 'Optimiste' },
  { id: 'persuasive', name: 'Persuasif' },
  { id: 'playful', name: 'Ludique' },
  { id: 'professional', name: 'Professionnel' },
  { id: 'sarcastic', name: 'Sarcastique' },
  { id: 'urgent', name: 'Urgent' }
];

interface DynamicVariable {
  id: string;
  name: string;
  value: string;
}

interface Template {
  id: string;
  name: string;
  contentType: string;
}

interface Tone {
  id: string;
  name: string;
}

interface ContentSettings {
  tone: string;
  length: number;
  keywords: string[];
  template: string;
  dynamicVariables: DynamicVariable[];
}

interface ImageGenerationParams {
  prompt: string;
  keywords: string[];
  quality: string;
  size: string;
  style: string;
}

interface ImageGenerationResponse {
  message: string;
  imageUrl: string;
}

const ContentGeneration = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [prompt, setPrompt] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({
    text: null,
    image: null,
    video: null
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  // Image generation specific state
  const [imageQuality, setImageQuality] = useState<string>('hd');
  const [imageSize, setImageSize] = useState<string>('1024x1024');
  const [imageStyle, setImageStyle] = useState<string>('natural');
  
  // Conserver les templates mais supprimer les états liés à l'ajout de templates personnalisés
  const [templates] = useState<Template[]>(initialTemplates);
  const [tones, setTones] = useState<Tone[]>(initialTones);
  
  // Variable management
  const [newVariableName, setNewVariableName] = useState('');
  
  // Content settings
  const [settings, setSettings] = useState<ContentSettings>({
    tone: 'professional',
    length: 75,
    keywords: [],
    template: '',
    dynamicVariables: [] // Suppression des variables dynamiques par défaut
  });

  const [videoDuration, setVideoDuration] = useState<string>("5");
  const [videoResolution, setVideoResolution] = useState<string>("720p");
  
  // Ajout de l'état manquant pour l'audio
  const [audioPrompt, setAudioPrompt] = useState<string>('');

  // Ajouter cette variable manquante pour le prompt négatif
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  
  // Ajouter cet état pour stocker l'ID de la vidéo générée
  const [generatedVideoId, setGeneratedVideoId] = useState<string | null>(null);

  // Ajouter l'état pour le chargement lors de l'ajout d'audio
  const [isAddingAudio, setIsAddingAudio] = useState<boolean>(false);

  // Ajouter cet état pour le chargement lors de l'extension de vidéo
  const [isExtendingVideo, setIsExtendingVideo] = useState<boolean>(false);

  // Utiliser le hook useContent pour la génération de contenu
  const { 
    generateContent,
    generateImage,
    generateVideo,
    loading: { 
      generate: isApiGenerating, 
      generateImage: isApiImageGenerating,
      generateVideo: isApiVideoGenerating 
    }
  } = useContent();
  
  // Ajoutez le hook pour la génération de description vidéo
  const { generateVideoDescription, loading: isGeneratingDescription } = useVideoDescription();

  // Ajout du nouveau hook
  const { generateAudioDescription, loading: isGeneratingAudioDescription } = useAudioDescription();

  // Importation du hook pour l'ajout d'audio à la vidéo
  const { addAudioToVideo, loading: isAudioLoading } = useAddAudioToVideo();

  // Ajouter le hook pour l'extension de vidéo
  const { extendVideo, loading: isExtendVideoLoading } = useExtendVideo();

  const addKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword('');
    }
  };
  
  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setFilePreview(preview);
      
      toast.success("Fichier téléchargé avec succès");
    }
  };
  
  const handleVariableChange = (id: string, value: string) => {
    setSettings({
      ...settings,
      dynamicVariables: settings.dynamicVariables.map(variable => 
        variable.id === id ? { ...variable, value } : variable
      )
    });
  };
  
  // Add new variable
  const handleAddVariable = () => {
    if (newVariableName.trim() === '') {
      toast.error('Le nom de la variable ne peut pas être vide');
      return;
    }
    
    const newVariable = {
      id: Date.now().toString(),
      name: newVariableName,
      value: ''
    };
    
    setSettings({
      ...settings,
      dynamicVariables: [...settings.dynamicVariables, newVariable]
    });
    
    setNewVariableName('');
    toast.success('Nouvelle variable ajoutée');
  };
  
  // Remove variable
  const handleRemoveVariable = (id: string) => {
    setSettings({
      ...settings,
      dynamicVariables: settings.dynamicVariables.filter(variable => variable.id !== id)
    });
    toast.success('Variable supprimée');
  };
  
  // Ajouter ces nouveaux états pour la gestion de vidéo avancée
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [isCheckingVideo, setIsCheckingVideo] = useState<boolean>(false);
  const [videoCheckAttempts, setVideoCheckAttempts] = useState<number>(0);
  const MAX_VIDEO_CHECK_ATTEMPTS = 10; // Maximum d'essais de vérification

  // Fonction pour vérifier si une vidéo est accessible
  const checkVideoAvailability = useCallback(async (url: string) => {
    if (!url) return false;
    
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        cache: 'no-cache',
      });
      return response.ok;
    } catch (error) {
      console.log("Vidéo pas encore disponible, nouvel essai bientôt...");
      return false;
    }
  }, []);

  // Fonction pour démarrer le polling de vérification vidéo
  const startVideoAvailabilityCheck = useCallback((url: string) => {
    if (!url) return;
    
    setIsCheckingVideo(true);
    setVideoCheckAttempts(0);
    setIsVideoReady(false);
    
    const checkInterval = setInterval(async () => {
      setVideoCheckAttempts(prev => {
        const newAttempts = prev + 1;
        
        // Si on dépasse le nombre max d'essais, on arrête
        if (newAttempts > MAX_VIDEO_CHECK_ATTEMPTS) {
          clearInterval(checkInterval);
          setIsCheckingVideo(false);
          console.log("Nombre maximum de tentatives atteint - arrêt de la vérification");
          return newAttempts;
        }
        
        return newAttempts;
      });
      
      const isAvailable = await checkVideoAvailability(url);
      
      if (isAvailable) {
        clearInterval(checkInterval);
        setIsVideoReady(true);
        setIsCheckingVideo(false);
        console.log("La vidéo est maintenant disponible !");
        toast.success("La vidéo est prête à être visualisée");
      }
    }, 3000); // Vérification toutes les 3 secondes
    
    // Nettoyage de l'intervalle si le composant est démonté
    return () => clearInterval(checkInterval);
  }, [checkVideoAvailability]);

  // Modifier la fonction handleGeneration pour intégrer la vérification vidéo
  const handleGeneration = async () => {
    if (activeTab === 'video' && !prompt) {
      toast.error("Veuillez remplir la description de la vidéo");
      return;
    }

    if (!prompt && keywords.length === 0) {
      toast.error("Veuillez ajouter un prompt ou des mots-clés");
      return;
    }
    
    // Vérification des variables dynamiques pour la génération de texte
    if (activeTab === 'text' && settings.dynamicVariables.length > 0) {
      const emptyVariables = settings.dynamicVariables.filter(variable => !variable.value.trim());
      if (emptyVariables.length > 0) {
        toast.error(`Veuillez remplir toutes les variables dynamiques (${emptyVariables.map(v => v.name).join(', ')})`);
        return;
      }
    }
    
    setIsGenerating(true);
    
    try {
      if (activeTab === 'text') {
        // Préparer les variables pour l'API texte
        const variablesObject: Record<string, string> = {};
        settings.dynamicVariables.forEach(variable => {
          variablesObject[variable.name] = variable.value;
        });
        
        // Préparer les paramètres pour l'API texte
        const templateItem = templates.find(t => t.id === settings.template);
        
        const personalization: ContentPersonalization = {
          ton: tones.find(t => t.id === settings.tone)?.name || 'professionnel',
          longueur: `${settings.length}%`,
          modelType: templateItem?.name || 'article de blog',
          promptInstructions: prompt,
          variables: variablesObject
        };
        
        const params: ContentGenerationParams = {
          type: 'text',
          keywords: keywords,
          personalization: personalization
        };
        
        const response = await generateContent(params);
        
        if (response && response.content && response.content.length > 0) {
          const content = response.content[0];
          setGeneratedContent(prev => ({
            ...prev,
            text: {
              type: 'text',
              content: content.content || ''
            }
          }));
          toast.success(response.message || "Texte généré avec succès");
          // Réinitialiser le prompt après une génération réussie
          setPrompt('');
        } else {
          toast.error("Aucun contenu n'a été généré");
        }
      } else if (activeTab === 'image') {
        // Préparer les paramètres pour l'API d'image
        const imageParams: ImageGenerationParams = {
          prompt: prompt,
          keywords: keywords,
          quality: imageQuality,
          size: imageSize,
          style: imageStyle
        };
        
        try {
          const response = await generateImage(imageParams);
          
          setGeneratedContent(prev => ({
            ...prev,
            image: {
              type: 'image',
              content: response.imageUrl
            }
          }));
          
          toast.success(response.message || "Image générée avec succès");
          // Réinitialiser le prompt après une génération réussie
          setPrompt('');
        } catch (error) {
          console.error("Erreur lors de la génération de l'image:", error);
          toast.error("Erreur lors de la génération de l'image");
        }
      } else if (activeTab === 'video') {
        if (!prompt) {
          toast.error("Veuillez entrer une description pour la vidéo");
          return;
        }
        
        // Préparer les paramètres pour l'API de vidéo
        const videoParams: VideoGenerationParams = {
          prompt: prompt,
          resolution: videoResolution,
          duration: `${videoDuration}s`
        };
        
        console.log("Envoi des paramètres vidéo:", videoParams);
        
        try {
          const response = await generateVideo(videoParams);
          console.log("Réponse de l'API vidéo:", response);
          
          // Stocker l'ID de la vidéo générée
          setGeneratedVideoId(response.id);
          
          // Stocker l'URL de la vidéo et démarrer la vérification de disponibilité
          const videoUrl = response.videoUrl;
          
          setGeneratedContent(prev => ({
            ...prev,
            video: {
              type: 'video',
              content: videoUrl
            }
          }));
          
          console.log("Video URL reçue:", videoUrl);
          
          // Démarrer le processus de vérification de la vidéo
          startVideoAvailabilityCheck(videoUrl);
          
          toast.success(response.message || "Vidéo générée avec succès! Vérification en cours...");
          // Réinitialiser le prompt après une génération réussie
          setPrompt('');
        } catch (error) {
          console.error("Erreur lors de la génération de la vidéo:", error);
          toast.error("Erreur lors de la génération de la vidéo");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la génération du contenu:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Ajoutez cette nouvelle fonction
  const handleGenerateVideoDescription = async () => {
    if (keywords.length === 0) {
      toast.error("Veuillez ajouter au moins un mot-clé");
      return;
    }

    try {
      const response = await generateVideoDescription({ keywords });
      setPrompt(response.description);
      toast.success(response.message || "Description générée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la génération de la description");
    }
  };

  // Fonction pour générer la description audio à partir de la vidéo
  const handleGenerateAudioFromVideo = async () => {
    if (!prompt) {
      toast.error("La description de la vidéo est vide");
      return;
    }

    try {
      const response = await generateAudioDescription({ content: prompt });
      setAudioPrompt(response.description);
      toast.success(response.message || "Description audio générée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la génération de la description audio");
    }
  };

  // Suppression de la fonction filterTemplatesByType qui n'est pas utilisée
  
  const filterTemplatesByCategory = () => {
    return {
      WordPress: templates.filter(template => template.id.startsWith('wordpress')),
      Facebook: templates.filter(template => template.id.startsWith('facebook')),
      Instagram: templates.filter(template => template.id.startsWith('instagram')),
      LinkedIn: templates.filter(template => template.id.startsWith('linkedin')),
      Twitter: templates.filter(template => template.id.startsWith('twitter')),
      Autres: templates.filter(template => 
        !['wordpress', 'facebook', 'instagram', 'linkedin', 'twitter'].some(prefix => template.id.startsWith(prefix))
      )
    };
  };

  // Fonction pour ajouter de l'audio à la vidéo
  const handleAddAudioToVideo = async () => {
    if (!generatedVideoId) {
      toast.error("Aucune vidéo n'a été générée. Veuillez d'abord générer une vidéo.");
      return;
    }
    
    if (!audioPrompt) {
      toast.error("Veuillez entrer une description pour l'audio");
      return;
    }
    
    try {
      // Indiquer que l'opération est en cours
      setIsAddingAudio(true);
      toast.info("Ajout d'audio à la vidéo en cours...");
      
      const response = await addAudioToVideo({
        videoId: generatedVideoId,
        params: {
          prompt: audioPrompt,
          negativePrompt: negativePrompt || undefined
        }
      });
      
      console.log("Réponse après l'ajout d'audio:", response);
      
      // Mettre à jour le contenu généré avec la nouvelle URL de vidéo avec audio
      setGeneratedContent(prev => ({
        ...prev,
        video: {
          type: 'video',
          content: response.videoAudioUrl
        }
      }));
      
      // Réinitialiser les états de vérification de vidéo pour éventuellement vérifier 
      // la disponibilité de la nouvelle vidéo avec audio
      setIsVideoReady(false);
      setIsCheckingVideo(false);
      
      // Commencer à vérifier la disponibilité de la nouvelle vidéo avec audio
      startVideoAvailabilityCheck(response.videoAudioUrl);
      
      toast.success(response.message || "Audio ajouté avec succès à la vidéo");
    } catch (error) {
      console.error("Erreur lors de l'ajout d'audio à la vidéo:", error);
      toast.error("Erreur lors de l'ajout d'audio à la vidéo");
    } finally {
      setIsAddingAudio(false);
    }
  };

  // Fonction pour étendre une vidéo existante
  const handleExtendVideo = async () => {
    if (!generatedVideoId) {
      toast.error("Aucune vidéo n'a été générée. Veuillez d'abord générer une vidéo.");
      return;
    }
    
    if (!prompt) {
      toast.error("Veuillez entrer une description pour l'extension de la vidéo");
      return;
    }
    
    try {
      // Indiquer que l'opération est en cours
      setIsExtendingVideo(true);
      toast.info("Extension de la vidéo en cours...");
      
      const response = await extendVideo({
        id: generatedVideoId,
        prompt: prompt
      });
      
      console.log("Réponse après l'extension de la vidéo:", response);
      
      // Mettre à jour l'ID de la vidéo générée avec le nouvel ID
      setGeneratedVideoId(response.id);
      
      // Mettre à jour le contenu généré avec la nouvelle URL de vidéo étendue
      setGeneratedContent(prev => ({
        ...prev,
        video: {
          type: 'video',
          content: response.extendedVideoUrl // Correction ici: utiliser extendedVideoUrl au lieu de videoUrl
        }
      }));
      
      // Réinitialiser les états de vérification de vidéo
      setIsVideoReady(false);
      setIsCheckingVideo(false);
      
      // Commencer à vérifier la disponibilité de la nouvelle vidéo étendue
      startVideoAvailabilityCheck(response.extendedVideoUrl); // Correction ici également
      
      toast.success(response.message || "Vidéo étendue avec succès");
    } catch (error) {
      console.error("Erreur lors de l'extension de la vidéo:", error);
      toast.error("Erreur lors de l'extension de la vidéo");
    } finally {
      setIsExtendingVideo(false);
    }
  };

  // Définition de la variable pour le prompt WordPress
  const wordpressFormattingPrompt = `Transforme le texte suivant en HTML pour WordPress :
- Mets les balises HTML nécessaires pour styler correctement le texte (<h1>, <h2>, <p>, <strong>...).
- Réponds uniquement avec le code HTML brut, sans balises \`\`\`html, sans \`\`\` ni aucune explication ou commentaire.
- Ne fais apparaître que le code HTML, prêt à être collé directement dans WordPress.

Voici le texte :

`;

  const renderGeneratedContent = () => {
    const content = generatedContent[activeTab];
    if (!content) return null;
    
    switch (content.type) {
      case 'text':
        return (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Contenu généré</h3>
            <div className="p-4 bg-white border rounded-md shadow-sm min-h-[200px] whitespace-pre-line">
              {content.content.split('\n').map((paragraph: string, i: number) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              {/* Remplacer "Modifier" par "Personnaliser" et activer le bouton */}
              <Button 
                variant="outline" 
                onClick={() => {
                  setPrompt(`Modifie le texte ci-dessous : \n\n ${content.content} `);
                  // Faire défiler vers le haut jusqu'à la zone de prompt
                  const promptElement = document.getElementById('prompt');
                  if (promptElement) {
                    promptElement.scrollIntoView({ behavior: 'smooth' });
                    promptElement.focus();
                  }
                }}
              >
                Personnaliser
              </Button>
              
              {/* Nouveau bouton Mise en forme WordPress modifié pour utiliser la variable */}
              <Button 
                variant="outline" 
                onClick={() => {
                  setPrompt(wordpressFormattingPrompt + content.content);
                  // Faire défiler vers le haut jusqu'à la zone de prompt
                  const promptElement = document.getElementById('prompt');
                  if (promptElement) {
                    promptElement.scrollIntoView({ behavior: 'smooth' });
                    promptElement.focus();
                  }
                }}
              >
                Mise en forme WordPress
              </Button>
              
              <Button onClick={() => {
                // Créer un blob et télécharger le contenu
                const blob = new Blob([content.content], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `contenu-genere-${new Date().toISOString().slice(0, 10)}.txt`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success("Contenu téléchargé avec succès");
              }}>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Image générée</h3>
            <div className="p-2 bg-white border rounded-md shadow-sm">
              <img 
                src={content.content} 
                alt="Generated content" 
                className="rounded-md max-h-[400px] mx-auto"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => {
                // Ouvrir une nouvelle fenêtre avec l'URL de l'image
                window.open(content.content, '_blank');
                toast.success("Image ouverte dans un nouvel onglet pour téléchargement");
              }}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Vidéo générée</h3>
            {isCheckingVideo ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Vérification de la disponibilité de la vidéo... 
                  Tentative {videoCheckAttempts}/{MAX_VIDEO_CHECK_ATTEMPTS}
                </p>
              </div>
            ) : (
              <VideoTest videoUrl={content.content} />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Génération de contenu</h1>
          </div>
          
          <Tabs 
            defaultValue="text" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Texte
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Image
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <FileVideo className="h-4 w-4" />
                Vidéo
              </TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 space-y-6 ${activeTab !== 'text' ? 'lg:col-span-3' : ''}`}>
                <TabsContent value="text" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Génération de texte</CardTitle>
                      <CardDescription>
                        Créez des articles, des billets de blog, des légendes pour les réseaux sociaux, etc.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="template">Modèle</Label>
                        <Select 
                          onValueChange={(value) => setSettings({...settings, template: value})}
                          value={settings.template}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un modèle" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(filterTemplatesByCategory()).map(([category, templates]) => (
                              <div key={category}>
                                <div className="px-2 py-1 text-sm font-semibold text-gray-500">{category}</div>
                                {templates.map(template => (
                                  <SelectItem key={template.id} value={template.id}>
                                    {template.name}
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="prompt">Prompt / Instructions (optionnel)</Label>
                        <Textarea 
                          id="prompt"
                          placeholder="Décrivez le contenu que vous souhaitez générer..."
                          className="min-h-32"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Mots-clés</Label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Ajouter un mot-clé" 
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addKeyword();
                              }
                            }}
                          />
                          <Button onClick={addKeyword} disabled={!newKeyword}>Ajouter</Button>
                        </div>
                        
                        {keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {keywords.map((keyword) => (
                              <Badge
                                key={keyword}
                                variant="secondary"
                                className="cursor-pointer hover:bg-gray-200"
                                onClick={() => removeKeyword(keyword)}
                              >
                                {keyword} &times;
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          onClick={handleGeneration} 
                          disabled={isGenerating || isApiGenerating}
                          className="w-full"
                        >
                          {isGenerating || isApiGenerating ? (
                            <>Génération en cours...</>
                          ) : (
                            <>
                              <Wand2 className="mr-2 h-4 w-4" />
                              Générer le texte
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {renderGeneratedContent()}
                </TabsContent>
                
                <TabsContent value="image" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Génération d'images</CardTitle>
                      <CardDescription>
                        Créez des images graphiques, infographies, illustrations, etc.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="prompt">Description de l'image</Label>
                        <Textarea 
                          id="prompt"
                          placeholder="Décrivez l'image que vous souhaitez générer..."
                          className="min-h-32"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quality">Qualité</Label>
                          <Select 
                            value={imageQuality} 
                            onValueChange={setImageQuality}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Qualité" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hd">HD</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="size">Taille</Label>
                          <Select 
                            value={imageSize} 
                            onValueChange={setImageSize}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Taille" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1024x1024">1024x1024</SelectItem>
                              <SelectItem value="1792x1024">1792x1024</SelectItem>
                              <SelectItem value="1024x1792">1024x1792</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="style">Style</Label>
                          <Select 
                            value={imageStyle} 
                            onValueChange={setImageStyle}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vivid">Vivid</SelectItem>
                              <SelectItem value="natural">Natural</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      {/* Section Image personnalisée commentée pour le moment
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          Image personnalisée
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        </Label>
                        <div className="border-2 border-dashed rounded-md p-6 text-center">
                          {filePreview ? (
                            <div className="space-y-2">
                              <img 
                                src={filePreview} 
                                alt="Uploaded preview" 
                                className="mx-auto max-h-[200px] rounded-md"
                              />
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setUploadedFile(null);
                                  setFilePreview(null);
                                }}
                              >
                                Supprimer et télécharger un autre
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 mb-2">
                                Téléchargez une image pour l'intégrer ou la modifier
                              </p>
                              <label htmlFor="image-upload">
                                <Button variant="outline" className="cursor-pointer" asChild>
                                  <span>Parcourir les fichiers</span>
                                </Button>
                              </label>
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                              />
                            </>
                          )}
                        </div>
                      </div>
                      */}
                      
                      <div className="space-y-2">
                        <Label>Mots-clés</Label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Ajouter un mot-clé" 
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addKeyword();
                              }
                            }}
                          />
                          <Button onClick={addKeyword} disabled={!newKeyword}>Ajouter</Button>
                        </div>
                        
                        {keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {keywords.map((keyword) => (
                              <Badge
                                key={keyword}
                                variant="secondary"
                                className="cursor-pointer hover:bg-gray-200"
                                onClick={() => removeKeyword(keyword)}
                              >
                                {keyword} &times;
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          onClick={handleGeneration} 
                          disabled={isGenerating || isApiImageGenerating}
                          className="w-full"
                        >
                          {isGenerating || isApiImageGenerating ? (
                            <>Génération en cours...</>
                          ) : (
                            <>
                              <Wand2 className="mr-2 h-4 w-4" />
                              Générer l'image
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {renderGeneratedContent()}
                </TabsContent>
                
                <TabsContent value="video" className="mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Génération de vidéos</CardTitle>
                        <CardDescription>
                          Créez des vidéos courtes pour les réseaux sociaux, basées sur des mots-clés.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="prompt">Description de la vidéo</Label>
                          <div className="space-y-2">
                            <Textarea 
                              id="prompt"
                              placeholder="Décrivez la vidéo que vous souhaitez générer..."
                              className="min-h-32"
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              required
                            />
                            <Button 
                              variant="outline"
                              className="w-full flex items-center justify-center gap-2"
                              onClick={handleGenerateVideoDescription}
                              disabled={isGeneratingDescription || keywords.length === 0}
                            >
                              {isGeneratingDescription ? (
                                <>Génération en cours...</>
                              ) : (
                                <>
                                  <Wand2 className="h-4 w-4" />
                                  Générer la description à partir des mots-clés
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-2">
                          <Label>Options de vidéo</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="duration" className="text-sm">Durée</Label>
                              <Select 
                                value={videoDuration}
                                onValueChange={setVideoDuration}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Durée" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="5">5 secondes</SelectItem>
                                  <SelectItem value="9">9 secondes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="resolution" className="text-sm">Résolution</Label>
                              <Select 
                                value={videoResolution}
                                onValueChange={setVideoResolution}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Résolution" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="540p">540p</SelectItem>
                                  <SelectItem value="720p">720p (HD)</SelectItem>
                                  <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                                  <SelectItem value="4k">4K (Ultra HD)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Mots-clés</Label>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Ajouter un mot-clé" 
                              value={newKeyword}
                              onChange={(e) => setNewKeyword(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addKeyword();
                                }
                              }}
                            />
                            <Button onClick={addKeyword} disabled={!newKeyword}>Ajouter</Button>
                          </div>
                          
                          {keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {keywords.map((keyword) => (
                                <Badge
                                  key={keyword}
                                  variant="secondary"
                                  className="cursor-pointer hover:bg-gray-200"
                                  onClick={() => removeKeyword(keyword)}
                                >
                                  {keyword} &times;
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="pt-4 space-y-2">
                          <Button 
                            onClick={handleGeneration} 
                            disabled={isGenerating || isApiVideoGenerating}
                            className="w-full"
                          >
                            {isGenerating || isApiVideoGenerating ? (
                              <>Génération en cours...</>
                            ) : (
                              <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Générer la vidéo
                              </>
                            )}
                          </Button>
                          
                          {/* Ajouter le bouton pour étendre la vidéo */}
                          {generatedVideoId && (
                            <Button 
                              onClick={handleExtendVideo} 
                              disabled={isExtendingVideo || isExtendVideoLoading || !prompt}
                              className="w-full"
                              variant="outline"
                            >
                              {isExtendingVideo || isExtendVideoLoading ? (
                                <>Extension en cours...</>
                              ) : (
                                <>
                                  <Wand2 className="mr-2 h-4 w-4" />
                                  Étendre la vidéo
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Carte pour la génération audio */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Génération d'Audio</CardTitle>
                        <CardDescription>
                          Créez des sons et des effets sonores à partir de descriptions textuelles.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="audioPrompt">Description de l'audio</Label>
                          <Textarea 
                            id="audioPrompt"
                            placeholder="Décrivez l'audio que vous souhaitez générer..."
                            className="min-h-32"
                            value={audioPrompt}
                            onChange={(e) => setAudioPrompt(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="negativePrompt">Éléments à éviter (optionnel)</Label>
                          <Textarea 
                            id="negativePrompt"
                            placeholder="Décrivez les éléments que vous souhaitez éviter dans l'audio..."
                            className="min-h-20"
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                          />
                        </div>
                        
                        <div className="pt-4 space-y-4">
                          <Button 
                            className="w-full"
                            variant="outline"
                            disabled={!prompt || isGeneratingAudioDescription}
                            onClick={handleGenerateAudioFromVideo}
                          >
                            {isGeneratingAudioDescription ? (
                              <>Génération en cours...</>
                            ) : (
                              <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Générer la description à partir de la vidéo
                              </>
                            )}
                          </Button>
                          
                          <Button 
                            className="w-full"
                            disabled={!audioPrompt || !generatedVideoId || isAddingAudio}
                            onClick={handleAddAudioToVideo}
                          >
                            {isAddingAudio ? (
                              <>Génération de l'audio en cours...</>
                            ) : (
                              <>
                                <Wand2 className="mr-2 h-4 w-4" />
                                Générer l'audio
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Affichage du contenu généré (vidéo) */}
                  {renderGeneratedContent()}
                </TabsContent>
              </div>
              {activeTab === 'text' && (
                <div className="lg:col-span-1 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personnalisation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="tone">Ton</Label>
                        <Select 
                          value={settings.tone} 
                          onValueChange={(value) => setSettings({...settings, tone: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un ton" />
                          </SelectTrigger>
                          <SelectContent>
                            {tones.map(tone => (
                              <SelectItem key={tone.id} value={tone.id}>
                                {tone.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="length">Longueur</Label>
                        <Select 
                          value={settings.length.toString()} // Convertir en string pour le composant Select
                          onValueChange={(value) => setSettings({...settings, length: Number(value)})} // Convertir en number
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une longueur" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">Très court</SelectItem>
                            <SelectItem value="50">Court</SelectItem>
                            <SelectItem value="75">Moyen</SelectItem>
                            <SelectItem value="100">Long</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label>Variables dynamiques</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="text-sm text-gray-500">
                                  Les variables dynamiques permettent de personnaliser votre contenu. Entrez le nom de la variable. Après avoir ajouté la variable, 
                                  vous pourrez définir sa valeur qui sera utilisée dans le contenu généré.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        {settings.dynamicVariables.map(variable => (
                          <div key={variable.id} className="flex gap-2 items-center mb-2">
                            <div className="grid grid-cols-3 gap-2 flex-1">
                              <div className="flex items-center">
                                <Label className="text-sm truncate" title={variable.name}>
                                  {variable.name}
                                </Label>
                              </div>
                              <Input 
                                value={variable.value} 
                                onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                                placeholder={`Valeur pour ${variable.name}`}
                                className="col-span-2"
                                required
                              />
                            </div>
                            <Button variant="outline" size="icon" onClick={() => handleRemoveVariable(variable.id)}>
                              <span className="sr-only">Supprimer</span>
                              &times;
                            </Button>
                          </div>
                        ))}
                        <div className="pt-2 border-t mt-2">
                          <Label className="text-sm mb-2 block">Ajouter une nouvelle variable</Label>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Nom de la variable" 
                              value={newVariableName}
                              onChange={(e) => setNewVariableName(e.target.value)}
                              className="flex-1"
                            />
                            <Button onClick={handleAddVariable} disabled={!newVariableName} size="sm">
                              Ajouter
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ContentGeneration;
