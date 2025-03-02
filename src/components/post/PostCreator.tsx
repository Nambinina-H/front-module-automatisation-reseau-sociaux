
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

interface PostCreatorProps {
  className?: string;
}

const PostCreator: React.FC<PostCreatorProps> = ({ className }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Array<'linkedin' | 'instagram' | 'twitter' | 'facebook'>>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  const togglePlatform = (platform: 'linkedin' | 'instagram' | 'twitter' | 'facebook') => {
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
            {(['linkedin', 'instagram', 'twitter', 'facebook'] as const).map((platform) => (
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
                )}
              >
                <PlatformIcon platform={platform} className="mr-2" />
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Toggle>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium">Mots-clés</label>
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
              className="flex-1"
            />
            <Button 
              onClick={addKeyword}
              iconLeft={<Plus size={16} />}
              disabled={!newKeyword}
            >
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
        
        <div className="space-y-3">
          <label className="text-sm font-medium">Planification</label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  iconLeft={<CalendarIcon size={16} />}
                >
                  {date ? format(date, 'PPP') : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              iconLeft={<Clock size={16} />}
            >
              Sélectionner une heure
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-6">
        <Button variant="outline">Enregistrer comme brouillon</Button>
        <Button>Planifier</Button>
      </CardFooter>
    </Card>
  );
};

export default PostCreator;
