
import React from 'react';
import UsersManagement from '@/components/admin/UsersManagement';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Admin = () => {
  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
        <p className="text-muted-foreground">
          Gérez les utilisateurs et leurs permissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des Utilisateurs</CardTitle>
          <CardDescription>
            Créez, modifiez ou supprimez des comptes utilisateurs
          </CardDescription>
        </CardHeader>
        <UsersManagement />
      </Card>
    </div>
  );
};

export default Admin;
