
import { useState, useCallback } from 'react';
import { apiService } from '@/services/apiService';
import { User, Content, Log, LoginCredentials, RegisterCredentials, AuthResponse, ContentGenerationParams, PublishParams, ContentGenerationResponse, ImageGenerationParams, ImageGenerationResponse } from '@/services/apiService';

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

  return {
    login: executeLogin,
    register: executeRegister,
    logout,
    profile,
    fetchProfile,
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
    updateContent: executeUpdate,
    deleteContent,
    fetchContentList,
    loading: {
      list: listLoading,
      generate: generateLoading,
      generateImage: generateImageLoading,
      update: updateLoading,
      delete: deleteLoading
    },
    error: {
      list: listError,
      generate: generateError,
      generateImage: generateImageError,
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

export function useLogs() {
  const {
    data: logsResponse,
    loading: logsLoading,
    error: logsError,
    execute: fetchLogsData
  } = useApi<{ message: string, logs: Log[] }>(apiService.getLogs.bind(apiService), { message: '', logs: [] });

  const logs = logsResponse?.logs || [];

  const {
    execute: executeExport,
    loading: exportLoading,
    error: exportError
  } = useApi<Blob, 'csv' | 'json'>(apiService.exportLogs.bind(apiService));

  const fetchLogs = useCallback(
    async (params?: { user_id?: string; action?: string; page?: number; limit?: number }) => {
      try {
        return await fetchLogsData(params);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    },
    [fetchLogsData]
  );

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
    logs,
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
