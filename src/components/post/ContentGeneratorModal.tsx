
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import Badge from "@/components/common/Badge";
import { Wand2, FileText, Image } from "lucide-react";
import { toast } from "sonner";
import { useContent } from '@/hooks/useApi';
import { ContentGenerationParams, ContentPersonalization } from '@/services/apiService';

interface ContentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (content: { text?: string, imageUrl?: string }) => void;
  initialKeywords?: string[];
  contentType?: 'text' | 'image' | 'video';
}

// Initial tones
const initialTones = [
  { id: 'professional', name: 'Professionnel' },
  { id: 'casual', name: 'Décontracté' },
  { id: 'friendly', name: 'Amical' },
  { id: 'formal', name: 'Formel' },
  { id: 'humorous', name: 'Humoristique' },
  { id: 'inspirational', name: 'Inspirant' },
  { id: 'informative', name: 'Informatif' },
  { id: 'persuasive', name: 'Persuasif' }
];

// Sample template data
const initialTemplates = [
  { id: 'post', name: 'Post social', contentType: 'text' },
  { id: 'article', name: 'Article de blog', contentType: 'text' },
  { id: 'social', name: 'Légende pour réseaux sociaux', contentType: 'text' },
  { id: 'banner', name: 'Bannière sociale', contentType: 'image' },
  { id: 'infographic', name: 'Infographie', contentType: 'image' }
];

const ContentGeneratorModal: React.FC<ContentGeneratorModalProps> = ({ 
  isOpen, 
  onClose,
  onGenerated,
  initialKeywords = [],
  contentType = 'text'
}) => {
  const [activeTab, setActiveTab] = useState(contentType);
  const [prompt, setPrompt] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState(75);
  const [template, setTemplate] = useState('');
  const [generatedContent, setGeneratedContent] = useState<{ text?: string, imageUrl?: string }>({});
  
  // Image generation specific state
  const [imageQuality, setImageQuality] = useState<string>('hd');
  const [imageSize, setImageSize] = useState<string>('1024x1024');
  const [imageStyle, setImageStyle] = useState<string>('natural');
  
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
        
        // Préparer les paramètres pour l'API texte
        const templateItem = initialTemplates.find(t => t.id === template);
        
        const personalization: ContentPersonalization = {
          ton: initialTones.find(t => t.id === tone)?.name || 'professionnel',
          longueur: `${length}%`,
          modelType: templateItem?.name || 'post social',
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
          setGeneratedContent({ text: content.content || '' });
          toast.success(response.message || "Texte généré avec succès");
        } else {
          toast.error("Aucun contenu n'a été généré");
          simulateTextGeneration();
        }
      } else if (activeTab === 'image') {
        // Préparer les paramètres pour l'API d'image
        const imageParams = {
          prompt: prompt,
          keywords: keywords,
          quality: imageQuality,
          size: imageSize,
          style: imageStyle
        };
        
        try {
          const response = await generateImage(imageParams);
          
          setGeneratedContent({ imageUrl: response.imageUrl });
          
          toast.success(response.message || "Image générée avec succès");
        } catch (error) {
          console.error("Erreur lors de la génération de l'image:", error);
          toast.error("Erreur lors de la génération de l'image");
          simulateImageGeneration();
        }
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
  
  const simulateTextGeneration = () => {
    const placeholderText = `Voici un exemple de contenu généré basé sur vos mots-clés: ${keywords.join(', ')}.
    
Ce texte simule ce que l'IA pourrait générer pour un ${initialTemplates.find(t => t.id === template)?.name || 'post social'} avec un ton ${initialTones.find(t => t.id === tone)?.name || 'professionnel'}.

Remplacez ce texte par du contenu réel lorsque le service de génération sera pleinement opérationnel.`;
    
    setGeneratedContent({ text: placeholderText });
  };
  
  const simulateImageGeneration = () => {
    const placeholderImages = [
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&h=400',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&h=400',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=400'
    ];
    
    setGeneratedContent({ 
      imageUrl: placeholderImages[Math.floor(Math.random() * placeholderImages.length)] 
    });
  };
  
  const simulateGeneration = () => {
    if (activeTab === 'text') {
      simulateTextGeneration();
    } else if (activeTab === 'image') {
      simulateImageGeneration();
    }
  };
  
  const filterTemplatesByType = (contentType: string) => {
    return initialTemplates.filter(template => template.contentType === contentType);
  };
  
  const renderGeneratedContent = () => {
    if (activeTab === 'text' && generatedContent.text) {
      return (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Contenu généré</h3>
          <div className="p-4 bg-white border rounded-md shadow-sm min-h-[150px] max-h-[250px] overflow-y-auto whitespace-pre-line">
            {generatedContent.text.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-2">{paragraph}</p>
            ))}
          </div>
        </div>
      );
    } else if (activeTab === 'image' && generatedContent.imageUrl) {
      return (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Image générée</h3>
          <div className="p-2 bg-white border rounded-md shadow-sm">
            <img 
              src={generatedContent.imageUrl} 
              alt="Image générée" 
              className="rounded-md max-h-[200px] mx-auto"
            />
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  const handleApply = () => {
    onGenerated(generatedContent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Générateur de contenu</DialogTitle>
          <DialogDescription>
            Générez du contenu en utilisant l'intelligence artificielle.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => setActiveTab(value as 'text' | 'image' | 'video')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Texte
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Image
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template">Modèle</Label>
              <Select 
                value={template}
                onValueChange={setTemplate}
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
              <Label htmlFor="prompt">Instructions</Label>
              <Textarea 
                id="prompt"
                placeholder="Décrivez le contenu que vous souhaitez générer..."
                className="min-h-20"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Ton</Label>
                <Select 
                  value={tone} 
                  onValueChange={setTone}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un ton" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialTones.map(tone => (
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
                  value={length.toString()}
                  onValueChange={(value) => setLength(Number(value))}
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
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Description de l'image</Label>
              <Textarea 
                id="prompt"
                placeholder="Décrivez l'image que vous souhaitez générer..."
                className="min-h-20"
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
          </TabsContent>
          
          <div className="space-y-2 mt-4">
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
              <Button variant="outline" onClick={addKeyword} disabled={!newKeyword}>
                Ajouter
              </Button>
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
              disabled={isGenerating || isApiGenerating || isApiImageGenerating}
              className="w-full"
            >
              {isGenerating || isApiGenerating || isApiImageGenerating ? (
                <>Génération en cours...</>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Générer le contenu
                </>
              )}
            </Button>
          </div>
          
          {renderGeneratedContent()}
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleApply}
            disabled={!generatedContent.text && !generatedContent.imageUrl}
          >
            Appliquer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentGeneratorModal;
