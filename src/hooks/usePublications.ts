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
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);

  const fetchPublications = async (
    page: number = 1, 
    status: string | null = null,
    platform: string | null = null
  ) => {
    setLoading(true);
    try {
      // Construire les paramètres de requête
      const params: Record<string, any> = { page };
      
      if (status) {
        params.status = status;
      }
      
      if (platform) {
        params.platform = platform;
      }
      
      setActiveStatus(status); // Stocker le statut actif
      setActivePlatform(platform); // Stocker la plateforme active
      
      const response = await apiService.getUserPublications(page, 10, params);
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
      fetchPublications(pagination.page + 1, activeStatus, activePlatform);
    }
  };

  const previousPage = () => {
    if (pagination.hasPreviousPage) {
      fetchPublications(pagination.page - 1, activeStatus, activePlatform);
    }
  };

  const filterByStatus = (status: string | null) => {
    fetchPublications(1, status === 'all' ? null : status, activePlatform);
  };

  const filterByPlatform = (platform: string | null) => {
    fetchPublications(1, activeStatus, platform === '' ? null : platform);
  };

  return {
    publications,
    loading,
    error,
    pagination,
    fetchPublications,
    nextPage,
    previousPage,
    filterByStatus,
    filterByPlatform,
    activeStatus,
    activePlatform
  };
}
