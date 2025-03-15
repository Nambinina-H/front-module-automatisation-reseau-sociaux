
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import Badge from '@/components/common/Badge';
import PlatformIcon from '@/components/common/PlatformIcon';
import { Clock, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  platforms: Array<'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'wordpress'>;
  keywords: string[];
  scheduledDate: Date;
  status: 'scheduled' | 'published' | 'draft';
  className?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  content,
  platforms,
  keywords,
  scheduledDate,
  status,
  className,
}) => {
  const statusColors = {
    scheduled: 'bg-amber-100 text-amber-800',
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    scheduled: 'Planifié',
    published: 'Publié',
    draft: 'Brouillon',
  };

  return (
    <Card 
      className={cn(
        'w-full fancy-border card-hover',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-1">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            statusColors[status]
          )}>
            {statusLabels[status]}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {platforms.map((platform) => (
            <PlatformIcon key={platform} platform={platform} size={18} />
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{content}</p>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <Clock size={14} className="mr-1" />
          <span>{format(scheduledDate, 'dd MMM yyyy')}</span>
        </div>
        
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
            <Trash2 size={14} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
