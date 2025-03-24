import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Button from '@/components/common/Button';
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
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

interface PostCreatorProps {
  className?: string;
}

const PostCreator: React.FC<PostCreatorProps> = ({ className }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Array<'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'wordpress'>>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined); // Remove default date
  const [selectedHour, setSelectedHour] = useState<string>('12');
  const [selectedMinute, setSelectedMinute] = useState<string>('00');
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState(false);
  
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
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
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
    if (!date) return "Aucune date sélectionnée";
    
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

  const handlePublish = () => {
    if (!title) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter un titre à votre post",
        variant: "destructive"
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une plateforme",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Post créé avec succès",
      description: isScheduled ? `Votre post sera publié le ${getFormattedDateTime()}` : "Votre post a été publié",
    });
  };

  return (
    <Card className={cn('w-full fancy-border', className)}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Créer un nouveau post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">Titre</label>
          <Input 
            placeholder="Titre de votre post" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium">Contenu</label>
          <Textarea 
            placeholder="Que souhaitez-vous partager ?" 
            className="min-h-32 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium">Plateformes</label>
          <div className="flex flex-wrap gap-2">
            {(['linkedin', 'instagram', 'twitter', 'facebook', 'wordpress'] as const).map((platform) => (
              <Toggle
                key={platform}
                pressed={selectedPlatforms.includes(platform)}
                onPressedChange={() => togglePlatform(platform)}
                className={cn(
                  'data-[state=on]:bg-gray-100 h-10 px-3',
                  selectedPlatforms.includes(platform) && 
                  platform === 'linkedin' && 'data-[state=on]:text-socialBlue',
                  selectedPlatforms.includes(platform) && 
                  platform === 'instagram' && 'data-[state=on]:text-socialBlue-instagram',
                  selectedPlatforms.includes(platform) && 
                  platform === 'twitter' && 'data-[state=on]:text-socialBlue-twitter',
                  selectedPlatforms.includes(platform) && 
                  platform === 'facebook' && 'data-[state=on]:text-socialBlue-facebook',
                  selectedPlatforms.includes(platform) && 
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
        <Button onClick={handlePublish}>Publier</Button>
      </CardFooter>
    </Card>
  );
};

export default PostCreator;
