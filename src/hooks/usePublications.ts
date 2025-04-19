import { useState, useEffect } from 'react';
import { apiService, Publication, PublicationsResponse } from '@/services/apiService';
import { toast } from '@/components/ui/use-toast';

export function usePublications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const fetchPublications = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await apiService.getUserPublications(page);
      setPublications(response.publications);
      setPagination({
        page: response.pagination.page,
        totalPages: response.pagination.totalPages,
        hasNextPage: response.pagination.hasNextPage,
        hasPreviousPage: response.pagination.hasPreviousPage
      });
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des publications:', err);
      setError('Impossible de charger les publications');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les publications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const nextPage = () => {
    if (pagination.hasNextPage) {
      fetchPublications(pagination.page + 1);
    }
  };

  const previousPage = () => {
    if (pagination.hasPreviousPage) {
      fetchPublications(pagination.page - 1);
    }
  };

  return {
    publications,
    loading,
    error,
    pagination,
    fetchPublications,
    nextPage,
    previousPage
  };
}
