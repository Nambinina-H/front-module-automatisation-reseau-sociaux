
import React from 'react';
import { format } from 'date-fns';
import PostCard from '@/components/dashboard/PostCard';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import PlatformIcon from '@/components/common/PlatformIcon';
import Badge from '@/components/common/Badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink } from 'lucide-react';

type Content = {
  id: string;
  title: string;
  content: string;
  platforms: Array<'linkedin' | 'instagram' | 'twitter' | 'facebook'>;
  keywords: string[];
  scheduledDate: Date;
  status: 'scheduled' | 'published' | 'draft';
};

interface Publication1Props {
  posts: Content[];
  viewMode: 'grid' | 'list';
}

const Publication1: React.FC<Publication1Props> = ({ posts, viewMode }) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="fade-in">
            <PostCard {...post} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Titre</TableHead>
            <TableHead>Plateformes</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  {post.platforms.map((platform) => (
                    <PlatformIcon key={platform} platform={platform} size={18} />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={post.status === 'published' ? 'default' : 'secondary'}
                >
                  {post.status === 'published' ? 'Publié' : 'Planifié'}
                </Badge>
              </TableCell>
              <TableCell>{format(post.scheduledDate, 'dd/MM/yyyy HH:mm')}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Publication1;
