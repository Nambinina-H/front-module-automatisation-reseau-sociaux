import React from 'react';
import PlatformIcon from '@/components/common/PlatformIcon';
import Badge from '@/components/common/Badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Publication } from '@/services/apiService';
import { Skeleton } from '@/components/ui/skeleton';

interface Publication1Props {
  posts: Publication[];
  isLoading?: boolean;
}

// Composant pour afficher un squelette de ligne pendant le chargement
const TableRowSkeleton = () => (
  <tr>
    <td className="px-4 py-2 border-b"><Skeleton className="h-6 w-[80%]" /></td>
    <td className="px-4 py-2 border-b text-center"><Skeleton className="h-6 w-6 rounded-full mx-auto" /></td>
    <td className="px-4 py-2 border-b text-center"><Skeleton className="h-6 w-16 mx-auto" /></td>
    <td className="px-4 py-2 border-b text-center"><Skeleton className="h-6 w-20 mx-auto" /></td>
    <td className="px-4 py-2 border-b text-center"><Skeleton className="h-6 w-32 mx-auto" /></td>
    <td className="px-4 py-2 border-b text-center">
      <div className="flex justify-center">
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </td>
  </tr>
);

// Composant pour afficher une ligne vide sans bordure
const EmptyRow = () => (
  <tr className="h-[48px] border-none">
    <td colSpan={6} className="border-none"></td>
  </tr>
);

const Publication1: React.FC<Publication1Props> = ({ posts, isLoading = false }) => {
  // Nombre total de lignes souhaitées dans le tableau
  const totalRowsToDisplay = 10;

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="w-[250px] px-4 py-2 border-b">Aperçu du contenu</th>
              <th className="px-4 py-2 border-b text-center">Plateforme</th>
              <th className="px-4 py-2 border-b text-center">Type</th>
              <th className="px-4 py-2 border-b text-center">Statut</th>
              <th className="px-4 py-2 border-b text-center">Date</th>
              <th className="px-4 py-2 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array(totalRowsToDisplay).fill(0).map((_, index) => (
              <TableRowSkeleton key={index} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="w-[250px] px-4 py-2 border-b">Aperçu du contenu</th>
            <th className="px-4 py-2 border-b text-center">Plateforme</th>
            <th className="px-4 py-2 border-b text-center">Type</th>
            <th className="px-4 py-2 border-b text-center">Statut</th>
            <th className="px-4 py-2 border-b text-center">Date</th>
            <th className="px-4 py-2 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody className={posts.length === 0 ? "border-none" : ""}>
          {posts.length > 0 ? (
            <>
              {/* Afficher les publications disponibles */}
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-4 py-2 border-b font-medium">{post.content_preview}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <div className="flex justify-center items-center">
                      <PlatformIcon platform={post.platform} size={18} />
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b text-center">{post.type}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <div className="flex justify-center">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status === 'published' ? 'Publié' : 'Planifié'}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {post.published_at ? 
                      new Date(post.published_at).toLocaleString() : 
                      post.schedule_time ? 
                        new Date(post.schedule_time).toLocaleString() :
                        new Date(post.created_at).toLocaleString()
                    }
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    <div className="flex justify-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(post.content_url, '_blank')}
                      >
                        <ExternalLink size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Ajouter des lignes vides pour compléter jusqu'à 10 lignes */}
              {posts.length < totalRowsToDisplay && 
                Array(totalRowsToDisplay - posts.length).fill(0).map((_, index) => (
                  <EmptyRow key={`empty-${index}`} />
                ))
              }
            </>
          ) : (
            <>
              {/* Afficher 4 lignes vides au-dessus du message */}
              {Array(4).fill(0).map((_, index) => (
                <EmptyRow key={`empty-top-${index}`} />
              ))}
              
              {/* Ligne avec le message */}
              <tr className="border-none hover:bg-transparent">
                <td 
                  colSpan={6} 
                  className="px-4 py-8 text-center text-muted-foreground text-lg border-none"
                >
                  Aucune publication trouvée
                </td>
              </tr>
              
              {/* Afficher 5 lignes vides en-dessous du message */}
              {Array(5).fill(0).map((_, index) => (
                <EmptyRow key={`empty-bottom-${index}`} />
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Publication1;
