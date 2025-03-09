
import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from '@/components/common/Button';
import { cn } from '@/lib/utils';

type AuthMode = 'login' | 'register';

const AuthForm = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading for demo purposes
    setTimeout(() => {
      setIsLoading(false);
      console.log('Auth data:', { email, password, authMode });
    }, 1500);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          {authMode === 'login' ? 'Connectez-vous' : 'Créez un compte'}
        </h2>
        <p className="text-muted-foreground mt-2">
          {authMode === 'login' 
            ? 'Entrez vos informations de connexion' 
            : 'Remplissez le formulaire pour créer votre compte'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
        >
          {authMode === 'login' ? 'Se connecter' : 'Créer un compte'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={toggleAuthMode}
          className="text-sm text-primary hover:underline focus:outline-none"
        >
          {authMode === 'login'
            ? "Vous n'avez pas de compte ? Inscrivez-vous"
            : 'Déjà un compte ? Connectez-vous'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
