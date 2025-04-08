
import React from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
import { Calendar, Edit, ExternalLink, Trash2 } from 'lucide-react';

type Content = {
  id: string;
  title: string;
  content: string;
  platforms: Array<'linkedin' | 'instagram' | 'twitter' | 'facebook'>;
  keywords: string[];
  scheduledDate: Date;
  status: 'scheduled' | 'published' | 'draft';
};

interface Publication2Props {
  posts: Content[];
  viewMode: 'grid' | 'list';
}

const Publication2: React.FC<Publication2Props> = ({ posts, viewMode }) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-1">
                <CardTitle className="text-lg font-medium">{post.title}</CardTitle>
                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                  {post.status === 'published' ? 'Publié' : 'Planifié'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.content}</p>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {post.keywords.map((keyword) => (
                  <Badge key={keyword} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-1">
                  {post.platforms.map((platform) => (
                    <PlatformIcon key={platform} platform={platform} size={18} />
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={14} className="mr-1" />
                <span>{format(post.scheduledDate, 'dd MMM yyyy')}</span>
              </div>
              
              <div className="flex space-x-1">
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
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Contenu</TableHead>
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
              <TableCell className="max-w-[200px]">
                <p className="truncate">{post.content}</p>
              </TableCell>
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
              <TableCell>{format(post.scheduledDate, 'dd/MM/yyyy')}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button variant="outline" size="sm">
                    <Edit size={14} className="mr-1" /> Modifier
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 size={14} className="mr-1" /> Supprimer
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

export default Publication2;
