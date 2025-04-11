import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from '@/components/ui/use-toast';

// Types pour les différentes entités
export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  app_role?: string; // Add app_role property to User interface
  createdAt?: string;
}

export interface Content {
  id: string | number;
  title?: string;
  body?: string;
  content?: string;
  type?: 'text' | 'image' | 'video';
  keywords: string[];
  platforms?: string[];
  status: 'draft' | 'scheduled' | 'published' | 'generated';
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  scheduledDate?: string;
  schedule_time?: string | null;
  userId?: string;
  user_id?: string;
  personalization?: ContentPersonalization;
}

export interface ContentPersonalization {
  ton?: string;
  longueur?: string;
  modelType?: string;
  variables?: Record<string, string>;
  promptInstructions?: string;
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
  type: 'text' | 'image' | 'video';
  keywords: string[];
  personalization: ContentPersonalization;
  platforms?: string[];
}

export interface ContentGenerationResponse {
  message: string;
  content: Content[];
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

export interface ImageGenerationParams {
  prompt: string;
  keywords: string[];
  quality: string;
  size: string;
  style: string;
}

export interface ImageGenerationResponse {
  message: string;
  imageUrl: string;
}

export interface ImmediatePublishParams {
  content?: string;
  mediaUrl?: string; // URL du média après upload
  image?: File;
  video?: File;
  platforms: string[];
  type: 'text' | 'image' | 'video' | 'text-image' | 'text-video';
}

export interface MediaUploadResponse {
  url: string;
  type: 'image' | 'video';
}

export interface ConfigKeys {
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  url?: string;
  key?: string;
  serviceRoleKey?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
}

export interface ApiConfig {
  id: string;
  user_id: string;
  platform: string;
  keys: ConfigKeys;
  created_at: string;
  updated_at: string;
}

export interface ApiConfigResponse {
  message: string;
  data: ApiConfig[];
}

interface PaginatedResponse<T> {
  message: string;
  logs: T[];
  pagination: {
    page: number;
    limit: number;
    totalLogs: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface VideoDescriptionParams {
  keywords: string[];
}

export interface VideoDescriptionResponse {
  message: string;
  description: string;
}

interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}

export interface VideoGenerationParams {
  prompt: string;
  resolution: string;
  duration: string;
}

export interface VideoGenerationResponse {
  message: string;
  videoUrl: string;
  id: string;
}

// Classe principale du service API
class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    const baseURL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'https://backend-module-generation-contenu.up.railway.app/';
    
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

  private handleAuthError(error: AxiosError): string {
    if (error.response?.status === 400) {
      const errorData = error.response.data as any;
      
      if (errorData.message) {
        return errorData.message;
      }

      // Messages d'erreur spécifiques
      switch (errorData.error) {
        case 'Invalid login credentials':
          return 'Email ou mot de passe incorrect';
        case 'User already registered':
          return 'Cet email est déjà utilisé';
        case 'invalid_email':
          return 'Format d\'email invalide';
        case 'Password should be at least 6 characters.':
          return 'Le mot de passe doit contenir au moins 6 caractères';
        default:
          return 'Une erreur est survenue lors de l\'authentification';
      }
    }
    return error.message || 'Une erreur est survenue';
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

  private setUser(user: User): void {
    console.log('Storing user in localStorage:', user); // Debug log
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    console.log('Retrieved user from localStorage:', user); // Debug log
    return user ? JSON.parse(user) : null;
  }

  private clearUser(): void {
    console.log('Clearing user from localStorage'); // Debug log
    localStorage.removeItem('user');
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
      const message = this.handleAuthError(error as AxiosError);
      toast({
        title: 'Erreur d\'inscription',
        description: message,
        variant: 'destructive'
      });
      throw new Error(message);
    }
  }

  // Connexion
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', credentials);
      const { user, token } = response.data;

      this.setToken(token);
      this.setUser(user); // Store user information

      console.log('User logged in:', user); // Debug log

      const appRole = user.app_role;
      if (appRole) {
        localStorage.setItem('app_role', appRole);
      }

      toast({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté!',
      });
      return response.data;
    } catch (error) {
      const message = this.handleAuthError(error as AxiosError);
      toast({
        title: 'Erreur de connexion',
        description: message,
        variant: 'destructive'
      });
      throw new Error(message);
    }
  }

  // Déconnexion
  logout(): void {
    console.log('Logging out user'); // Debug log
    this.clearToken();
    this.clearUser(); // Clear user information
    localStorage.removeItem('app_role');

    toast({
      title: 'Déconnexion',
      description: 'Vous avez été déconnecté avec succès.',
    });

    // Rediriger vers la page d'authentification au lieu de la page d'accueil
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

  // Suppression de compte
  async deleteAccount(userId: string): Promise<void> {
    try {
      await this.api.delete(`/auth/delete/${userId}`);
      this.logout(); // Déconnexion après suppression
      toast({
        title: 'Compte supprimé',
        description: 'Votre compte a été supprimé avec succès.',
      });
    } catch (error) {
      throw error;
    }
  }

  // Changement de mot de passe
  async changePassword(params: ChangePasswordParams): Promise<void> {
    try {
      const response = await this.api.put('/auth/change-password', params);
      toast({
        title: 'Succès',
        description: 'Votre mot de passe a été modifié avec succès.',
      });
    } catch (error: any) {
      const message = error.response?.data?.error || "Erreur lors du changement de mot de passe";
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive'
      });
      throw error;
    }
  }

  // ==== CONTENT MANAGEMENT ====
  
  // Générer du contenu
  async generateContent(params: ContentGenerationParams): Promise<ContentGenerationResponse> {
    try {
      const response = await this.api.post<ContentGenerationResponse>('/content/generate', params);
      toast({
        title: 'Contenu généré',
        description: 'Le contenu a été généré avec succès!',
      });
      return response.data;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  // Générer une image
  async generateImage(params: ImageGenerationParams): Promise<ImageGenerationResponse> {
    try {
      const response = await this.api.post<ImageGenerationResponse>('/image/generate', params);
      toast({
        title: 'Image générée',
        description: 'L\'image a été générée avec succès!',
      });
      return response.data;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  // Générer une description de vidéo
  async generateVideoDescription(params: VideoDescriptionParams): Promise<VideoDescriptionResponse> {
    try {
      const response = await this.api.post<VideoDescriptionResponse>('/video/description', params);
      return response.data;
    } catch (error) {
      console.error('Error generating video description:', error);
      throw error;
    }
  }

  async generateVideo(params: VideoGenerationParams): Promise<VideoGenerationResponse> {
    try {
      console.log('Envoi de la requête de génération vidéo avec les paramètres:', params);
      const response = await this.api.post<VideoGenerationResponse>('/video/generate', params);
      console.log('Réponse brute du serveur pour la génération vidéo:', response);
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée lors de la génération vidéo:', {
        error,
        message: error.message,
        response: error.response?.data
      });
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

  // Publier immédiatement du contenu
  async publishNow(params: ImmediatePublishParams): Promise<any> {
    try {
      const response = await this.api.post('/publish/now', params, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Upload média
  async uploadMedia(file: File): Promise<MediaUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('media', file);

      const response = await this.api.post<MediaUploadResponse>('/api/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

  // Publier sur WordPress
  async publishToWordPress(params: {
    content: string;
    mediaUrl?: string;
    type: 'text' | 'image' | 'video' | 'text-image' | 'text-video';
    date?: string;
    title: string;
  }): Promise<any> {
    try {
      const status = params.date ? "future" : "publish"; // Determine status based on date
      const payload = { ...params, status }; // Add status to the payload

      console.log('Données envoyées pour la publication WordPress:', payload); // Log the data being sent

      const response = await this.api.post('/publish/wordpress', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast({
        title: 'Publication réussie',
        description: 'Le contenu a été publié avec succès sur WordPress!',
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la publication sur WordPress:', error);
      throw error;
    }
  }

  // ==== LOGS ====
  
  // Récupérer les logs
  async getLogs(page: number = 1): Promise<PaginatedResponse<Log>> {
    try {
      const response = await this.api.get<PaginatedResponse<Log>>(`/logs?page=${page}`);
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

  // ==== CONFIGURATION ====

  async getConfigs(): Promise<ApiConfig[]> {
    try {
      const response = await this.api.get<ApiConfigResponse>('/api/config/list');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async updateConfig(id: string, keys: ConfigKeys): Promise<ApiConfig> {
    try {
      const response = await this.api.put<{message: string; data: ApiConfig}>(`/api/config/update/${id}`, { keys });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  generateWordPressAuthUrl(clientId: string, redirectUri: string): string {
    if (!clientId || !redirectUri) {
      throw new Error("Client ID et Redirect URI sont requis pour générer l'URL d'autorisation.");
    }
    return `https://public-api.wordpress.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
  }

  // Envoyer le code via une requête GET
  async sendCode(code: string): Promise<any> {
    try {
      const response = await this.api.get(`/api/config/list`, {
        params: { code },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Envoyer le code via une requête GET au backend
  async sendWordPressCode(code: string): Promise<any> {
    try {
      // S'assurer que seul le paramètre code est envoyé dans la requête
      const response = await this.api.get('/oauth/wordpress/callback', {
        params: { code }
      });
      
      console.log("Code envoyé au backend:", code);
      console.log("Réponse du backend:", response.data);
      
      if (response.data.message) {
        toast({
          title: 'Succès',
          description: response.data.message
        });
      }

      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'envoi du code:", error);
      const errorMessage = error.response?.data?.error || "Une erreur est survenue lors de la connexion à WordPress";
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  }

  async disconnectWordPress(): Promise<any> {
    try {
      const response = await this.api.post('/oauth/wordpress/disconnect');
      toast({
        title: 'Succès',
        description: 'WordPress déconnecté'
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la déconnexion de WordPress',
        variant: 'destructive'
      });
      throw error;
    }
  }
}

// Export d'une instance unique du service API
export const apiService = new ApiService();
