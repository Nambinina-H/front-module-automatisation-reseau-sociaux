
import React from 'react';
import { format } from 'date-fns';
import { Calendar, Globe, Tag, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlatformIcon from '@/components/common/PlatformIcon';
import Badge from '@/components/common/Badge';

type Content = {
  id: string;
  title: string;
  content: string;
  platforms: Array<'linkedin' | 'instagram' | 'twitter' | 'facebook'>;
  keywords: string[];
  scheduledDate: Date;
  status: 'scheduled' | 'published' | 'draft';
};

interface Publication3Props {
  posts: Content[];
  viewMode: 'grid' | 'list';
}

const Publication3: React.FC<Publication3Props> = ({ posts, viewMode }) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 gap-6">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="rounded-lg border p-5 hover:shadow-md transition-shadow duration-300 bg-white"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                  <Badge 
                    variant={post.status === 'published' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {post.status === 'published' ? 'Publié' : 'Planifié'}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-4">{post.content}</p>
                
                <div className="flex flex-wrap gap-2">
                  {post.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="flex items-center gap-1">
                      <Tag size={12} />
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col md:w-48 space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {format(post.scheduledDate, 'dd MMM yyyy HH:mm')}
                  </div>
                  
                  <div className="flex items-center">
                    <Globe size={14} className="mr-1 text-gray-500" />
                    <div className="flex space-x-1">
                      {post.platforms.map((platform) => (
                        <PlatformIcon key={platform} platform={platform} size={16} />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button size="sm" variant="outline" className="justify-start">
                    <Edit size={14} className="mr-1" /> Modifier
                  </Button>
                  <Button size="sm" variant="outline" className="justify-start">
                    <ExternalLink size={14} className="mr-1" /> Voir
                  </Button>
                  <Button size="sm" variant="outline" className="justify-start text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 size={14} className="mr-1" /> Supprimer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="rounded-lg border p-4 hover:shadow-md transition-shadow duration-300 bg-white"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">{post.title}</h3>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={post.status === 'published' ? 'default' : 'secondary'}
              >
                {post.status === 'published' ? 'Publié' : 'Planifié'}
              </Badge>
              <div className="flex space-x-1">
                {post.platforms.map((platform) => (
                  <PlatformIcon key={platform} platform={platform} size={16} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-500">
              <Calendar size={14} className="inline mr-1" />
              {format(post.scheduledDate, 'dd/MM/yyyy HH:mm')}
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="h-8 p-0 px-2">
                <Edit size={14} className="mr-1" /> Modifier
              </Button>
              <Button variant="ghost" size="sm" className="h-8 p-0 px-2">
                <ExternalLink size={14} className="mr-1" /> Voir
              </Button>
              <Button variant="ghost" size="sm" className="h-8 p-0 px-2 text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 size={14} className="mr-1" /> Supprimer
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Publication3;
