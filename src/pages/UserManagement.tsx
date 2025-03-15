import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

const UserManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        <main className="p-6">
          <div>
            Gestion utilisateurs
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
