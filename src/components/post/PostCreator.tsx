import React, { useState } from 'react';
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

interface PostCreatorProps {
  className?: string;
}

const PostCreator: React.FC<PostCreatorProps> = ({ className }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Array<'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'wordpress'>>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<string>('12');
  const [selectedMinute, setSelectedMinute] = useState<string>('00');
  const [selectedAmPm, setSelectedAmPm] = useState<string>('PM');
  
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
    return `${formattedDate} à ${selectedHour}:${selectedMinute} ${selectedAmPm}`;
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <Card className={cn('w-full fancy-border', className)}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Créer un nouveau post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">Titre</label>
          <Input placeholder="Titre de votre post" />
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium">Contenu</label>
          <Textarea 
            placeholder="Que souhaitez-vous partager ?" 
            className="min-h-32 resize-none"
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
          <label className="text-sm font-medium">Planification</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                iconLeft={<CalendarIcon size={16} />}
              >
                {date ? getFormattedDateTime() : "Sélectionner date et heure"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="space-y-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={fr}
                />
                
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Label className="text-sm font-medium">Heure</Label>
                  <div className="flex items-center gap-2">
                    <Select value={selectedHour} onValueChange={setSelectedHour}>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="Heure" />
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map(hour => (
                          <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <span>:</span>
                    
                    <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="Min" />
                      </SelectTrigger>
                      <SelectContent>
                        {minutes.map(minute => (
                          <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedAmPm} onValueChange={setSelectedAmPm}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-6">
        <Button>Publier</Button>
      </CardFooter>
    </Card>
  );
};

export default PostCreator;
