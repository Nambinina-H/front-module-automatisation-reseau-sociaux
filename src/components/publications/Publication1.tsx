import React from 'react';
import { format } from 'date-fns';
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
import { ExternalLink } from 'lucide-react';

type Content = {
  id: string;
  title: string;
  content: string;
  platform: 'linkedin' | 'instagram' | 'twitter' | 'facebook';
  keywords: string[];
  scheduledDate: Date;
  status: 'scheduled' | 'published' | 'draft';
  type: 'text' | 'image' | 'video';
};

interface Publication1Props {
  posts: Content[];
}

const Publication1: React.FC<Publication1Props> = ({ posts }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Aperçu du contenu</TableHead>
            <TableHead>Plateforme</TableHead>
            <TableHead>Type</TableHead>
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
                <PlatformIcon platform={post.platform} size={18} />
              </TableCell>
              <TableCell>{post.type}</TableCell>
              <TableCell>
                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                  {post.status === 'published' ? 'Publié' : 'Planifié'}
                </Badge>
              </TableCell>
              <TableCell>{format(post.scheduledDate, 'dd/MM/yyyy HH:mm')}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink size={14} />
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
