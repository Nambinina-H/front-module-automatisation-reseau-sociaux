import React, { useState } from 'react';
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
  Plus,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useContent } from '@/hooks/useApi';
import { ContentGenerationParams, ContentPersonalization } from '@/services/apiService';
import Maintenance from '@/components/ui/Maintenance';

// Sample template data
const initialTemplates = [
  { id: 'blog', name: 'Article de blog', contentType: 'text' },
  { id: 'social', name: 'Légende pour réseaux sociaux', contentType: 'text' },
  { id: 'newsletter', name: 'Newsletter', contentType: 'text' },
  { id: 'infographic', name: 'Infographie', contentType: 'image' },
  { id: 'banner', name: 'Bannière sociale', contentType: 'image' },
  { id: 'promo', name: 'Vidéo promotionnelle', contentType: 'video' },
  { id: 'tutorial', name: 'Tutoriel', contentType: 'video' }
];

// Initial tones
const initialTones = [
  { id: 'professional', name: 'Professionnel' },
  { id: 'casual', name: 'Décontracté' },
  { id: 'friendly', name: 'Amical' },
  { id: 'formal', name: 'Formel' },
  { id: 'humorous', name: 'Humoristique' },
  { id: 'inspirational', name: 'Inspirant' },
  { id: 'informative', name: 'Informatif' },
  { id: 'persuasive', name: 'Persuasif' },
  { id: 'empathetic', name: 'Empathique' },
  { id: 'authoritative', name: 'Autoritaire' },
  { id: 'playful', name: 'Ludique' },
  { id: 'urgent', name: 'Urgent' },
  { id: 'confident', name: 'Confiant' },
  { id: 'enthusiastic', name: 'Enthousiaste' },
  { id: 'sarcastic', name: 'Sarcastique' },
  { id: 'motivational', name: 'Motivant' },
  { id: 'calm', name: 'Calme' },
  { id: 'optimistic', name: 'Optimiste' },
  { id: 'neutral', name: 'Neutre' }
];

// Sample placeholders for generated content
const placeholderText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc vitae nisl.

Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

const placeholderImages = [
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&h=400',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&h=400',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=400'
];

const placeholderVideo = 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&h=400';

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
  
  // New state for template and tone management
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [tones, setTones] = useState<Tone[]>(initialTones);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateType, setNewTemplateType] = useState('text');
  const [newToneName, setNewToneName] = useState('');
  
  // Variable management
  const [newVariableName, setNewVariableName] = useState('');
  
  // Content settings
  const [settings, setSettings] = useState<ContentSettings>({
    tone: 'professional',
    length: 75,
    keywords: [],
    template: '',
    dynamicVariables: [
      { id: '1', name: 'Nom', value: 'Votre Entreprise' },
      { id: '2', name: 'Date', value: new Date().toLocaleDateString() },
      { id: '3', name: 'Lieu', value: 'Paris' }
    ]
  });

  // Utiliser le hook useContent pour la génération de contenu
  const { 
    generateContent,
    generateImage,
    loading: { generate: isApiGenerating, generateImage: isApiImageGenerating }
  } = useContent();
  
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
  
  // Add new template
  const handleAddTemplate = () => {
    if (newTemplateName.trim() === '') {
      toast.error('Le nom du modèle ne peut pas être vide');
      return;
    }
    
    const newTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      contentType: newTemplateType
    };
    
    setTemplates([...templates, newTemplate]);
    setNewTemplateName('');
    toast.success('Nouveau modèle ajouté');
  };
  
  // Add new tone
  const handleAddTone = () => {
    if (newToneName.trim() === '') {
      toast.error('Le nom du ton ne peut pas être vide');
      return;
    }
    
    const newTone = {
      id: Date.now().toString(),
      name: newToneName
    };
    
    setTones([...tones, newTone]);
    setNewToneName('');
    toast.success('Nouveau ton ajouté');
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
  
  const handleGeneration = async () => {
    if (!prompt && keywords.length === 0) {
      toast.error("Veuillez ajouter un prompt ou des mots-clés");
      return;
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
        } catch (error) {
          console.error("Erreur lors de la génération de l'image:", error);
          toast.error("Erreur lors de la génération de l'image");
          simulateImageGeneration();
        }
      } else if (activeTab === 'video') {
        simulateGeneration();
      }
    } catch (error) {
      console.error("Erreur lors de la génération du contenu:", error);
      toast.error("Erreur lors de la génération du contenu");
      
      // En cas d'erreur, simuler une réponse pour la démo
      simulateGeneration();
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Simulation spécifique pour les images
  const simulateImageGeneration = () => {
    setTimeout(() => {
      setGeneratedContent(prev => ({
        ...prev,
        image: {
          type: 'image',
          content: placeholderImages[Math.floor(Math.random() * placeholderImages.length)]
        }
      }));
      toast.success("Image générée avec succès (simulation)");
    }, 2000);
  };
  
  // Fallback en cas d'échec de l'API
  const simulateGeneration = () => {
    if (!prompt && keywords.length === 0) {
      toast.error("Veuillez ajouter un prompt ou des mots-clés");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsGenerating(false);
      
      // Generate different content based on active tab
      if (activeTab === 'text') {
        setGeneratedContent(prev => ({
          ...prev,
          text: {
            type: 'text',
            content: placeholderText
          }
        }));
        toast.success("Texte généré avec succès");
      } else if (activeTab === 'image') {
        setGeneratedContent(prev => ({
          ...prev,
          image: {
            type: 'image',
            content: placeholderImages[Math.floor(Math.random() * placeholderImages.length)]
          }
        }));
        toast.success("Image générée avec succès");
      } else if (activeTab === 'video') {
        setGeneratedContent(prev => ({
          ...prev,
          video: {
            type: 'video',
            content: placeholderVideo
          }
        }));
        toast.success("Aperçu de la vidéo généré avec succès");
      }
    }, 2000);
  };

  const filterTemplatesByType = (contentType: string) => {
    return templates.filter(template => template.contentType === contentType);
  };

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
              {/* TODO: Enable the "Modifier" button functionality in the future */}
              <Button variant="outline" disabled>Modifier</Button>
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
              {/* TODO: Enable the "Modifier" button functionality in the future */}
              <Button variant="outline" disabled>Modifier</Button>
              <Button onClick={() => {
                fetch(content.content)
                  .then(response => response.blob())
                  .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `image-generee-${new Date().toISOString().slice(0, 10)}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    toast.success("Image téléchargée avec succès");
                  })
                  .catch(() => toast.error("Erreur lors du téléchargement de l'image"));
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
            <h3 className="text-lg font-medium">Aperçu de la vidéo</h3>
            <div className="p-2 bg-white border rounded-md shadow-sm">
              <div className="relative pt-[56.25%] bg-gray-100 rounded-md">
                <img 
                  src={content.content} 
                  alt="Video preview" 
                  className="absolute inset-0 w-full h-full object-cover rounded-md"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="ghost" className="h-16 w-16 rounded-full bg-white/80">
                    <FileVideo className="h-8 w-8" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              {/* TODO: Enable the "Modifier" button functionality in the future */}
              <Button variant="outline" disabled>Personnaliser</Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
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
                        <div className="flex justify-between items-center">
                          <Label htmlFor="template">Modèle</Label>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8">
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Ajouter
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Ajouter un nouveau modèle</DialogTitle>
                                <DialogDescription>
                                  Créez un nouveau modèle pour la génération de contenu.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="templateName" className="text-right">
                                    Nom
                                  </Label>
                                  <Input
                                    id="templateName"
                                    value={newTemplateName}
                                    onChange={(e) => setNewTemplateName(e.target.value)}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="templateType" className="text-right">
                                    Type
                                  </Label>
                                  <Select 
                                    value={newTemplateType} 
                                    onValueChange={setNewTemplateType}
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Sélectionner un type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">Texte</SelectItem>
                                      <SelectItem value="image">Image</SelectItem>
                                      <SelectItem value="video">Vidéo</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Annuler</Button>
                                </DialogClose>
                                <Button onClick={handleAddTemplate}>Ajouter</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <Select 
                          onValueChange={(value) => setSettings({...settings, template: value})}
                          value={settings.template}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un modèle" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterTemplatesByType('text').map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="prompt">Prompt / Instructions</Label>
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
                      
                      {/* <Separator className="my-4" /> */}
                      
                      {/* <div className="space-y-2">
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
                      </div> */}
                      
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
                          />
                          <Button 
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() => {
                              // La logique de génération sera implémentée plus tard
                              toast.info("Cette fonctionnalité sera bientôt disponible");
                            }}
                          >
                            <Wand2 className="h-4 w-4" />
                            Générer la description à partir des mots-clés
                          </Button>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-2">
                        <Label>Options de vidéo</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="duration" className="text-sm">Durée</Label>
                            <Select defaultValue="5">
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
                            <Select defaultValue="720p">
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
                      
                      <div className="pt-4">
                        <Button 
                          onClick={handleGeneration} 
                          disabled={isGenerating}
                          className="w-full"
                        >
                          {isGenerating ? (
                            <>Génération en cours...</>
                          ) : (
                            <>
                              <Wand2 className="mr-2 h-4 w-4" />
                              Générer la vidéo
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                 
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
                        <Label>Variables dynamiques</Label>
                        {settings.dynamicVariables.map(variable => (
                          <div key={variable.id} className="flex gap-2 items-center">
                            <Input 
                              value={variable.value} 
                              onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                            />
                            <Button variant="outline" onClick={() => handleRemoveVariable(variable.id)}>Supprimer</Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Ajouter une variable" 
                            value={newVariableName}
                            onChange={(e) => setNewVariableName(e.target.value)}
                          />
                          <Button onClick={handleAddVariable} disabled={!newVariableName}>Ajouter</Button>
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
