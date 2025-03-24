import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Maintenance: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-100 rounded-lg">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700">En Maintenance</h2>
      <p className="text-gray-500 mt-2">Cette fonctionnalité est actuellement en maintenance. Veuillez revenir plus tard.</p>
    </div>
  );
};

export default Maintenance;
