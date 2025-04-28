import { useState, useCallback, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { 
  User, Content, Log, LoginCredentials, RegisterCredentials, AuthResponse, 
  ContentGenerationParams, PublishParams, ContentGenerationResponse, 
  ImageGenerationParams, ImageGenerationResponse, ImmediatePublishParams, 
  MediaUploadResponse, ApiConfig, ConfigKeys, VideoGenerationParams, 
  VideoGenerationResponse 
} from '@/services/apiService';
import { toast } from '../components/ui/use-toast';
export function useApi<T, P = any>(
  apiMethod: (params?: P) => Promise<T>,
  initialData?: T
) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (params?: P) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiMethod(params);
        setData(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiMethod]
  );

  return {
    data,
    loading,
    error,
    execute,
    setData,
  };
}

export function useAuth() {
  const { execute: executeLogin, loading: loginLoading, error: loginError } = 
    useApi<AuthResponse, LoginCredentials>(apiService.login.bind(apiService));
  
  const { execute: executeRegister, loading: registerLoading, error: registerError } = 
    useApi<AuthResponse, RegisterCredentials>(apiService.register.bind(apiService));
  
  const logout = useCallback(() => {
    apiService.logout();
  }, []);

  const { 
    data: profile, 
    loading: profileLoading, 
    error: profileError,
    execute: fetchProfile 
  } = useApi<User>(apiService.getProfile.bind(apiService));

  const user = apiService.getUser(); // Retrieve user from localStorage
  const userId = user?.id || null;
  const appRole = localStorage.getItem('app_role');

  console.log('useAuth - User:', user); // Debug log
  console.log('useAuth - User ID:', userId); // Debug log
  console.log('useAuth - App Role:', appRole); // Debug log

  return {
    login: executeLogin,
    register: executeRegister,
    logout,
    profile,
    fetchProfile,
    user, // Expose user
    userId, // Expose userId
    appRole, // Expose appRole
    isAuthenticated: apiService.isAuthenticated(),
    loading: {
      login: loginLoading,
      register: registerLoading,
      profile: profileLoading
    },
    error: {
      login: loginError,
      register: registerError,
      profile: profileError
    }
  };
}

export function useContent() {
  const { 
    data: contentList,
    loading: listLoading,
    error: listError,
    execute: fetchContentList,
    setData: setContentList
  } = useApi<Content[]>(apiService.getContentList.bind(apiService), []);

  const {
    execute: executeGenerate,
    loading: generateLoading,
    error: generateError
  } = useApi<ContentGenerationResponse, ContentGenerationParams>(apiService.generateContent.bind(apiService));

  const {
    execute: executeGenerateImage,
    loading: generateImageLoading,
    error: generateImageError
  } = useApi<ImageGenerationResponse, ImageGenerationParams>(apiService.generateImage.bind(apiService));

  const {
    execute: executeGenerateVideo,
    loading: generateVideoLoading,
    error: generateVideoError
  } = useApi<VideoGenerationResponse, VideoGenerationParams>(apiService.generateVideo.bind(apiService));

  const {
    execute: executeUpdate,
    loading: updateLoading,
    error: updateError
  } = useApi<Content, {id: string, data: Partial<Content>}>(apiService.updateContent.bind(apiService));

  const {
    execute: executeDelete,
    loading: deleteLoading,
    error: deleteError
  } = useApi<void, string>(apiService.deleteContent.bind(apiService));

  const deleteContent = useCallback(
    async (id: string) => {
      await executeDelete(id);
      if (contentList) {
        setContentList(contentList.filter(content => content.id !== id));
      }
    },
    [contentList, executeDelete, setContentList]
  );

  return {
    contentList,
    generateContent: executeGenerate,
    generateImage: executeGenerateImage,
    generateVideo: executeGenerateVideo,
    updateContent: executeUpdate,
    deleteContent,
    fetchContentList,
    loading: {
      list: listLoading,
      generate: generateLoading,
      generateImage: generateImageLoading,
      generateVideo: generateVideoLoading,
      update: updateLoading,
      delete: deleteLoading
    },
    error: {
      list: listError,
      generate: generateError,
      generateImage: generateImageError,
      generateVideo: generateVideoError,
      update: updateError,
      delete: deleteError
    }
  };
}

export function usePublish() {
  const {
    execute: executePublish,
    loading: publishLoading,
    error: publishError
  } = useApi<any, PublishParams>(apiService.publishContent.bind(apiService));

  const {
    execute: executeCancel,
    loading: cancelLoading,
    error: cancelError
  } = useApi<void, string>(apiService.cancelPublication.bind(apiService));

  return {
    publishContent: executePublish,
    cancelPublication: executeCancel,
    loading: {
      publish: publishLoading,
      cancel: cancelLoading
    },
    error: {
      publish: publishError,
      cancel: cancelError
    }
  };
}

export function usePublishNow() {
  const { execute, loading, error } = useApi<any, ImmediatePublishParams>(
    apiService.publishNow.bind(apiService)
  );

  return {
    publishNow: execute,
    loading,
    error
  };
}

export function useSchedulePublication() {
  const { execute, loading, error } = useApi<any, ImmediatePublishParams & { scheduledDate: string }>(
    apiService.schedulePublication.bind(apiService)
  );

  return {
    schedulePublication: execute,
    loading,
    error
  };
}

export function useLogs() {
  const {
    data: logsData,
    loading: logsLoading,
    error: logsError,
    execute: fetchLogs
  } = useApi<PaginatedResponse<Log>, number>(apiService.getLogs.bind(apiService));

  const {
    execute: executeExport,
    loading: exportLoading,
    error: exportError
  } = useApi<Blob, 'csv' | 'json'>(apiService.exportLogs.bind(apiService));

  const downloadLogs = useCallback(
    async (format: 'csv' | 'json' = 'csv') => {
      try {
        const blob = await executeExport(format);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-export.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error downloading logs:', error);
      }
    },
    [executeExport]
  );

  return {
    logs: logsData?.logs || [],
    pagination: logsData?.pagination,
    fetchLogs,
    exportLogs: executeExport,
    downloadLogs,
    loading: {
      fetch: logsLoading,
      export: exportLoading
    },
    error: {
      fetch: logsError,
      export: exportError
    }
  };
}

export function useUploadMedia() {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const uploadMedia = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const result = await apiService.uploadMedia(file, (progress) => {
        setUploadProgress(progress);
      });
      
      return result;
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadMedia,
    isUploading,
    uploadProgress
  };
}

export function useConfig() {
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getConfigs();
      setConfigs(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (id: string, keys: ConfigKeys) => {
    try {
      console.log('Updating config:', { id, keys }); // Debug log
      setLoading(true);
      const updatedConfig = await apiService.updateConfig(id, keys);
      setConfigs(prevConfigs => 
        prevConfigs.map(config => 
          config.id === id ? updatedConfig : config
        )
      );
      toast({
        title: 'Configuration mise à jour',
        description: 'Les paramètres ont été enregistrés avec succès.',
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la configuration.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const createConfig = useCallback(async (platform: string, keys: ConfigKeys) => {
    try {
      setLoading(true);
      const newConfig = await apiService.createConfig({ platform, keys });
      setConfigs(prevConfigs => [...prevConfigs, newConfig]);
      toast({
        title: 'Configuration créée',
        description: 'La configuration a été créée avec succès.',
      });
      return newConfig;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la configuration.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  return {
    configs,
    updateConfig,
    createConfig,
    loading,
    error,
    fetchConfigs
  };
}

export function useWordPressAuth() {
  const { execute, loading, error } = useApi<string, { clientId: string; redirectUri: string }>(
    ({ clientId, redirectUri }) => {
      return Promise.resolve(apiService.generateWordPressAuthUrl(clientId, redirectUri));
    }
  );

  return {
    generateAuthUrl: execute,
    loading,
    error,
  };
}

export function usePublishToWordPress() {
  const { execute, loading, error } = useApi<any, {
    content: string;
    mediaUrl?: string;
    type: 'text' | 'image' | 'video' | 'text-image' | 'text-video';
    date?: string;
    title: string;
  }>(apiService.publishToWordPress.bind(apiService));

  return {
    publishToWordPress: execute,
    loading,
    error,
  };
}

export function useVideoDescription() {
  const { execute, loading, error } = useApi<VideoDescriptionResponse, VideoDescriptionParams>(
    apiService.generateVideoDescription.bind(apiService)
  );

  return {
    generateVideoDescription: execute,
    loading,
    error
  };
}

export function useChangePassword() {
  const { execute, loading, error } = useApi<void, ChangePasswordParams>(
    apiService.changePassword.bind(apiService)
  );

  return {
    changePassword: execute,
    loading,
    error
  };
}

export function useTwitterAuth() {
  const { execute: getAuthUrl, loading: authLoading } = useApi(apiService.getTwitterAuthUrl.bind(apiService));
  const { execute: sendCode, loading: callbackLoading } = useApi(apiService.sendTwitterCode.bind(apiService));

  return {
    getAuthUrl,
    sendCode,
    loading: {
      auth: authLoading,
      callback: callbackLoading,
    },
  };
}

export function usePublishToTwitter() {
  const { execute, loading, error } = useApi<any, { content: string; mediaFile?: File; scheduledDate?: string }>(
    ({ content, mediaFile, scheduledDate }) => apiService.publishToTwitter(content, mediaFile, scheduledDate)
  );

  return {
    publishToTwitter: execute,
    loading,
    error,
  };
}

export function useAudioDescription() {
  const { execute, loading, error } = useApi<AudioDescriptionResponse, AudioDescriptionParams>(
    apiService.generateAudioDescription.bind(apiService)
  );

  return {
    generateAudioDescription: execute,
    loading,
    error
  };
}

export function useAddAudioToVideo() {
  const { execute, loading, error } = useApi<AddAudioToVideoResponse, {videoId: string, params: AddAudioToVideoParams}>(
    ({videoId, params}) => apiService.addAudioToVideo(videoId, params)
  );

  return {
    addAudioToVideo: execute,
    loading,
    error
  };
}

interface WeeklyAnalyticsResponse {
  message: string;
  startOfWeek: string;
  endOfWeek: string;
  dailyStats: {
    [day: string]: {
      facebook: number;
      linkedin: number;
      twitter: number;
      instagram: number;
      wordpress: number;
    };
  };
  platformTotals: {
    facebook: number;
    linkedin: number;
    twitter: number;
    instagram: number;
    wordpress: number;
  };
}

interface DailyStats {
  name: string;
  facebook: number;
  linkedin: number;
  twitter: number;
  instagram: number;
  wordpress: number;
  total: number;
}

interface WeeklyStats {
  dailyData: DailyStats[];
  platformTotals: {
    facebook: number;
    linkedin: number;
    twitter: number;
    instagram: number;
    wordpress: number;
  };
}

export function useWeeklyAnalytics() {
  const [data, setData] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  const fetchWeeklyStats = useCallback(async (forceRefresh = false) => {
    // Si les données existent déjà et que ça fait moins de 5 minutes qu'elles ont été chargées,
    // et qu'on ne force pas le rafraîchissement, on ne fait pas de nouvelle requête
    const now = Date.now();
    const fiveMinutesInMs = 5 * 60 * 1000;

    if (
      !forceRefresh && 
      data && 
      lastFetched && 
      now - lastFetched < fiveMinutesInMs
    ) {
      return data;
    }

    try {
      setLoading(true);
      const response = await apiService.api.get<WeeklyAnalyticsResponse>('/analytics/weekly');
      const apiData = response.data;
      
      // Transformer les données pour le format attendu par les composants
      const dailyData: DailyStats[] = Object.entries(apiData.dailyStats).map(([day, stats]) => {
        const total = Object.values(stats).reduce((sum, value) => sum + value, 0);
        return {
          name: day.substring(0, 3), // Prendre les 3 premières lettres du jour
          ...stats,
          total
        };
      });
      
      const result = {
        dailyData,
        platformTotals: apiData.platformTotals
      };
      
      setData(result);
      setLastFetched(now);
      setError(null);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      console.error("Erreur lors de la récupération des statistiques hebdomadaires:", errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, [data, lastFetched]);

  return {
    data,
    loading,
    error,
    fetchWeeklyStats
  };
}
