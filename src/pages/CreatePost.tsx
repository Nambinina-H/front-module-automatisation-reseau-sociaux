
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import PostCreator from '@/components/post/PostCreator';

const CreatePost = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-16 md:ml-60 transition-all duration-300">
        <Navbar />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Créer un post</h1>
          </div>
          
          <PostCreator />
        </main>
      </div>
    </div>
  );
};

export default CreatePost;
