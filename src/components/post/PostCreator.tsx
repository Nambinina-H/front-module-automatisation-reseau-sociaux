import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Button from '@/components/common/Button';
import { Calendar as CalendarIcon, Clock, Plus, UploadCloud, X } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import PlatformIcon from '@/components/common/PlatformIcon';
import Badge from '@/components/common/Badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Button as ShadcnButton } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { usePublishNow, useUploadMedia, usePublishToWordPress } from '@/hooks/useApi';

type ContentType = 'text' | 'text-image' | 'text-video' | 'image' | 'video';

interface PostCreatorProps {
  className?: string;
}

const platformConstraints = {
  facebook: { maxLength: 63000 },
  linkedin: { maxLength: 1300 },
  twitter: { maxLength: 280 },
  instagram: { maxLength: 2200 },
  wordpress: { maxLength: null }  // Pas de limite stricte
};

const PostCreator: React.FC<PostCreatorProps> = ({ className }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'wordpress' | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined); // Remove default date
  const [selectedHour, setSelectedHour] = useState<string>('12');
  const [selectedMinute, setSelectedMinute] = useState<string>('00');
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [contentType, setContentType] = useState<ContentType>('text');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { publishNow, loading } = usePublishNow();
  const { uploadMedia } = useUploadMedia();
  const { publishToWordPress, loading: wordpressLoading } = usePublishToWordPress();
  const [title, setTitle] = useState<string>(''); // Add state for title
  
  interface ImmediatePublishParams {
    platforms: string[];  // On garde le tableau pour la compatibilité avec l'API
    type: ContentType;
    content?: string;
    image?: File;
    video?: File;
    mediaUrl?: string;
  }
  
  const maxLength = platformConstraints[selectedPlatform]?.maxLength || null;
  const remainingCharacters = maxLength ? maxLength - content.length : null;

  // Handle clicks outside the time picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setTimePickerOpen(false);
      }
    }
    
    if (timePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [timePickerOpen]);
  
  // Log when hour or minute changes to debug
  useEffect(() => {
    console.log("Hour changed to:", selectedHour);
  }, [selectedHour]);

  useEffect(() => {
    console.log("Minute changed to:", selectedMinute);
  }, [selectedMinute]);
  
  const togglePlatform = (platform: 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'wordpress') => {
    if (selectedPlatform === platform) {
      setSelectedPlatform(null);
    } else {
      setSelectedPlatform(platform);
      // Réinitialiser le type de contenu si on sélectionne Instagram
      if (platform === 'instagram' && !['text-image', 'text-video'].includes(contentType)) {
        setContentType('text-image');
      }
    }
  };
  
  const addKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword('');
    }
  };
  
  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const getFormattedDateTime = () => {
    if (!isScheduled || !date) return "Publication immédiate";
    
    const formattedDate = format(date, 'dd MMMM yyyy', { locale: fr });
    return `${formattedDate} à ${selectedHour}:${selectedMinute}`;
  };

  // Generate hours in 24-hour format (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  // Handler for hour selection
  const handleHourChange = (value: string) => {
    const numValue = parseInt(value);
    if (numValue >= 0 && numValue <= 23) {
      setSelectedHour(numValue.toString().padStart(2, '0'));
    }
  };

  // Handler for minute selection
  const handleMinuteChange = (value: string) => {
    const numValue = parseInt(value);
    if (numValue >= 0 && numValue <= 59) {
      setSelectedMinute(numValue.toString().padStart(2, '0'));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérification de la taille de l'image pour Twitter
    if (type === 'image' && selectedPlatform === 'twitter') {
      const maxSize = 5 * 1024 * 1024; // 5 MB en octets
      if (file.size > maxSize) {
        toast({
          title: "Erreur",
          description: "L'image dépasse la taille maximale de 5 MB autorisée pour Twitter",
          variant: "destructive"
        });
        return;
      }
    }

    // Vérification de la durée de la vidéo pour Twitter
    if (type === 'video' && selectedPlatform === 'twitter') {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        const maxDuration = 140; // 2 minutes et 20 secondes en secondes

        if (duration > maxDuration) {
          toast({
            title: "Erreur",
            description: "La vidéo dépasse la durée maximale de 2 minutes et 20 secondes autorisée pour Twitter",
            variant: "destructive"
          });
          return;
        }

        // Si la durée est valide, on continue avec le traitement normal
        setVideoFile(file);
      };

      video.src = URL.createObjectURL(file);
      return;
    }

    // Traitement normal pour les autres cas
    if (type === 'image') {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setVideoFile(file);
    }
  };

  const handlePublish = async () => {
    if (!selectedPlatform) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une plateforme",
        variant: "destructive"
      });
      return;
    }

    // Validation du contenu selon le type
    if ((contentType.includes('text') && !content) ||
        (contentType.includes('image') && !imageFile) ||
        (contentType.includes('video') && !videoFile)) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive"
      });
      return;
    }

    try {
      let mediaUrl = '';

      // Upload de l'image ou de la vidéo si nécessaire
      if (contentType.includes('image') && imageFile) {
        const response = await uploadMedia(imageFile);
        mediaUrl = response.url;
      } else if (contentType.includes('video') && videoFile) {
        const response = await uploadMedia(videoFile);
        mediaUrl = response.url;
      }

      if (selectedPlatform === 'wordpress') {
        const publishParams = {
          content,
          mediaUrl,
          type: contentType,
          date: isScheduled && date ? `${date.toISOString().split('T')[0]}T${selectedHour}:${selectedMinute}:00` : undefined,
          title,
        };
        await publishToWordPress(publishParams);
      } else {
        const publishParams: ImmediatePublishParams = {
          platforms: [selectedPlatform],
          type: contentType,
          content,
          mediaUrl,
        };
        await publishNow(publishParams);
      }

      toast({
        title: "Publication réussie",
        description: "Votre contenu a été publié avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur de publication",
        description: error.message || "Une erreur est survenue lors de la publication",
        variant: "destructive"
      });
    }
  };

  const getAvailableContentTypes = () => {
    // Si Instagram est sélectionné
    if (selectedPlatform === 'instagram') {
      return [
        { value: 'text-image', label: 'Texte et image' },
        { value: 'text-video', label: 'Texte et vidéo' }
      ];
    }

    // Si Twitter est sélectionné
    if (selectedPlatform === 'twitter') {
      return [
        { value: 'text', label: 'Texte uniquement' },
        { value: 'text-image', label: 'Texte et image' },
        { value: 'text-video', label: 'Texte et vidéo' }
      ];
    }

    // Si LinkedIn est sélectionné
    if (selectedPlatform === 'linkedin') {
      return [
        { value: 'text', label: 'Texte uniquement' },
        { value: 'text-image', label: 'Texte et image' },
        { value: 'text-video', label: 'Texte et vidéo' }
      ];
    }

    // Si WordPress est sélectionné
    if (selectedPlatform === 'wordpress') {
      return [
        { value: 'text', label: 'Texte uniquement' },
        { value: 'text-image', label: 'Texte et image' },
        { value: 'text-video', label: 'Texte et vidéo' }
      ];
    }

    // Configuration par défaut pour les autres cas
    return [
      { value: 'text', label: 'Texte uniquement' },
      { value: 'text-image', label: 'Texte et image' },
      { value: 'text-video', label: 'Texte et vidéo' },
      { value: 'image', label: 'Image uniquement' },
      { value: 'video', label: 'Vidéo uniquement' }
    ];
  };

  // Effet pour réinitialiser le type de contenu si nécessaire
  useEffect(() => {
    if ((selectedPlatform === 'instagram') && !['text-image', 'text-video'].includes(contentType)) {
      setContentType('text-image');
    }
  }, [selectedPlatform]);

  return (
    <Card className={cn('w-full fancy-border', className)}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Publier un nouveau contenu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">Type de contenu</label>
          <Select
            value={contentType}
            onValueChange={(value: ContentType) => {
              setContentType(value);
              setImageFile(null);
              setVideoFile(null);
              setImagePreview(null);
              setContent('');
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type de contenu" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableContentTypes().map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedPlatform === 'wordpress' && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Titre</label>
            <Input 
              placeholder="Entrez le titre de votre contenu" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        )}

        {contentType.includes('text') && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Contenu</label>
            <Textarea 
              placeholder="Que souhaitez-vous partager ?" 
              className="min-h-32 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={maxLength || undefined}
            />
            {maxLength !== null && (
              <div className="text-right text-sm text-gray-500">
                {remainingCharacters} caractères restants
              </div>
            )}
          </div>
        )}

        {contentType.includes('image') && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Image</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={(e) => handleFileChange(e, 'image')}
              />
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gray-800 hover:bg-gray-700 border-0 shadow-lg"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <X className="h-4 w-4 text-white" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <UploadCloud className="h-8 w-8 mb-2 text-gray-400" />
                    <span className="text-sm text-gray-500">Cliquez pour télécharger une image</span>
                  </div>
                </label>
              )}
            </div>
          </div>
        )}

        {contentType.includes('video') && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Vidéo</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                id="video-upload"
                onChange={(e) => handleFileChange(e, 'video')}
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <UploadCloud className="h-8 w-8 mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {videoFile ? videoFile.name : "Cliquez pour télécharger une vidéo"}
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-medium">Plateformes</label>
          <div className="flex flex-wrap gap-2">
            {(['wordpress', 'facebook', 'twitter', 'linkedin', 'instagram'] as const).map((platform) => (
              <Toggle
                key={platform}
                pressed={selectedPlatform === platform}
                onPressedChange={() => togglePlatform(platform)}
                className={cn(
                  'data-[state=on]:bg-gray-100 h-10 px-3',
                  selectedPlatform === platform && 
                  platform === 'linkedin' && 'data-[state=on]:text-socialBlue',
                  selectedPlatform === platform && 
                  platform === 'instagram' && 'data-[state=on]:text-socialBlue-instagram',
                  selectedPlatform === platform && 
                  platform === 'twitter' && 'data-[state=on]:text-socialBlue-twitter',
                  selectedPlatform === platform && 
                  platform === 'facebook' && 'data-[state=on]:text-socialBlue-facebook',
                  selectedPlatform === platform && 
                  platform === 'wordpress' && 'data-[state=on]:text-socialBlue-wordpress',
                )}
              >
                <PlatformIcon platform={platform} className="mr-2" />
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Toggle>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="scheduled"
              checked={isScheduled}
              onCheckedChange={(checked) => {
                setIsScheduled(checked as boolean);
                if (!checked) {
                  setDate(undefined);
                  setSelectedHour('12');
                  setSelectedMinute('00');
                }
              }}
            />
            <label 
              htmlFor="scheduled" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Planifier la publication
            </label>
          </div>

          {isScheduled && (
            <div className="flex gap-4 mt-2">
              {/* Date picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <ShadcnButton
                    variant="outline"
                    className="w-[200px] h-10 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
                  </ShadcnButton>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={fr}
                    fromDate={new Date()}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              
              {/* Time picker */}
              <div className="flex items-center gap-2 border rounded-md px-3 h-10 min-w-[150px]">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center">
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    value={selectedHour}
                    onChange={(e) => handleHourChange(e.target.value)}
                    className="w-12 h-8 text-center p-0 border-0 focus-visible:ring-0"
                  />
                  <span className="mx-1">:</span>
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    value={selectedMinute}
                    onChange={(e) => handleMinuteChange(e.target.value)}
                    className="w-12 h-8 text-center p-0 border-0 focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-6">
        <Button onClick={handlePublish} disabled={loading}>
          {loading ? "Publication en cours..." : "Publier"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCreator;
