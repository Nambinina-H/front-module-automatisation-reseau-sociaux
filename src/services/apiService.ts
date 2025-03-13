
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from '@/components/ui/use-toast';

// Types pour les différentes entités
export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface Content {
  id: string;
  title: string;
  body: string;
  keywords: string[];
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  userId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ContentGenerationParams {
  keywords: string[];
  platforms: string[];
  tone?: string;
  length?: 'short' | 'medium' | 'long';
}

export interface PublishParams {
  contentId: string;
  platforms: string[];
  scheduledDate?: string;
}

export interface Log {
  id: string;
  action: string;
  userId: string;
  details: string;
  createdAt: string;
  ip?: string;
}

// Classe principale du service API
class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    const baseURL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'https://backend-module-generation-contenu.up.railway.app';
    
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token à chaque requête
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur pour gérer les erreurs globales
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );

    // Récupérer le token au démarrage s'il existe
    this.token = localStorage.getItem('auth_token');
  }

  // Gestion des erreurs
  private handleApiError(error: AxiosError): void {
    const status = error.response?.status;
    let message = 'Une erreur est survenue';

    switch (status) {
      case 401:
        message = 'Session expirée. Veuillez vous reconnecter.';
        this.logout();
        break;
      case 403:
        message = 'Accès refusé. Vous n\'avez pas les droits nécessaires.';
        break;
      case 404:
        message = 'Ressource non trouvée.';
        break;
      case 500:
        message = 'Erreur serveur. Veuillez réessayer plus tard.';
        break;
      default:
        message = error.message || 'Une erreur est survenue';
    }

    toast({
      title: 'Erreur',
      description: message,
      variant: 'destructive',
    });
  }

  // Gestion du token
  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  private getToken(): string | null {
    return this.token;
  }

  private clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Vérifie si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ==== AUTHENTICATION ====
  
  // Inscription
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/register', credentials);
      this.setToken(response.data.token);
      toast({
        title: 'Inscription réussie',
        description: 'Votre compte a été créé avec succès!',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Connexion
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', credentials);
      this.setToken(response.data.token);
      toast({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté!',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Déconnexion
  logout(): void {
    this.clearToken();
    toast({
      title: 'Déconnexion',
      description: 'Vous avez été déconnecté avec succès.',
    });
    // Rediriger vers la page de connexion
    window.location.href = '/auth';
  }

  // Récupérer le profil utilisateur
  async getProfile(): Promise<User> {
    try {
      const response = await this.api.get<User>('/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ==== CONTENT MANAGEMENT ====
  
  // Générer du contenu
  async generateContent(params: ContentGenerationParams): Promise<Content> {
    try {
      const response = await this.api.post<Content>('/content/generate', params);
      toast({
        title: 'Contenu généré',
        description: 'Le contenu a été généré avec succès!',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer la liste des contenus
  async getContentList(): Promise<Content[]> {
    try {
      const response = await this.api.get<Content[]>('/content/list');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer un contenu spécifique
  async getContent(id: string): Promise<Content> {
    try {
      const response = await this.api.get<Content>(`/content/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour un contenu
  async updateContent(id: string, data: Partial<Content>): Promise<Content> {
    try {
      const response = await this.api.put<Content>(`/content/update/${id}`, data);
      toast({
        title: 'Contenu mis à jour',
        description: 'Le contenu a été mis à jour avec succès!',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Supprimer un contenu
  async deleteContent(id: string): Promise<void> {
    try {
      await this.api.delete(`/content/delete/${id}`);
      toast({
        title: 'Contenu supprimé',
        description: 'Le contenu a été supprimé avec succès!',
      });
    } catch (error) {
      throw error;
    }
  }

  // ==== PUBLISHING ====
  
  // Publier du contenu
  async publishContent(params: PublishParams): Promise<any> {
    try {
      const response = await this.api.post('/publish', params);
      toast({
        title: 'Publication réussie',
        description: 'Le contenu a été envoyé pour publication!',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Annuler une publication planifiée
  async cancelPublication(contentId: string): Promise<void> {
    try {
      await this.api.post(`/publish/cancel`, { contentId });
      toast({
        title: 'Publication annulée',
        description: 'La publication a été annulée avec succès!',
      });
    } catch (error) {
      throw error;
    }
  }

  // ==== LOGS ====
  
  // Récupérer les logs
  async getLogs(): Promise<Log[]> {
    try {
      const response = await this.api.get<Log[]>('/logs');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Exporter les logs
  async exportLogs(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    try {
      const response = await this.api.get(`/logs/export?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Export d'une instance unique du service API
export const apiService = new ApiService();
