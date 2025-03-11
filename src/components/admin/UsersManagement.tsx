
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CardContent } from '@/components/ui/card';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

// Mock data for demonstration
const mockUsers: User[] = [
  { id: '1', email: 'admin@example.com', role: 'admin' },
  { id: '2', email: 'user@example.com', role: 'user' },
];

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleAddUser = (newUser: { email: string; password: string; role: 'user' | 'admin' }) => {
    const user = {
      id: Date.now().toString(),
      email: newUser.email,
      role: newUser.role,
    };
    setUsers([...users, user]);
    toast({
      title: "Utilisateur créé",
      description: `L'utilisateur ${newUser.email} a été créé avec succès.`,
    });
  };

  const handleUpdateUser = (user: User) => {
    setUsers(users.map(u => u.id === user.id ? user : u));
    toast({
      title: "Utilisateur modifié",
      description: `Les informations de ${user.email} ont été mises à jour.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "Utilisateur supprimé",
      description: "Le compte utilisateur a été supprimé avec succès.",
    });
  };

  return (
    <CardContent className="space-y-6">
      <div className="flex justify-end">
        <AddUserDialog onAddUser={handleAddUser} />
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">{user.email}</span>
              <span className="text-sm text-muted-foreground capitalize">{user.role}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <EditUserDialog user={user} onUpdateUser={handleUpdateUser} />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteUser(user.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  );
};

interface AddUserDialogProps {
  onAddUser: (user: { email: string; password: string; role: 'user' | 'admin' }) => void;
}

const AddUserDialog = ({ onAddUser }: AddUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser({ email, password, role });
    setOpen(false);
    setEmail('');
    setPassword('');
    setRole('user');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mot de passe</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Rôle</label>
            <Select value={role} onValueChange={(value: 'user' | 'admin') => setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Utilisateur</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Créer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface EditUserDialogProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const EditUserDialog = ({ user, onUpdateUser }: EditUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<'user' | 'admin'>(user.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, email, role });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Rôle</label>
            <Select value={role} onValueChange={(value: 'user' | 'admin') => setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Utilisateur</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Mettre à jour</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UsersManagement;
