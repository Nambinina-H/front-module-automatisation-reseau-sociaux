import React, { useState, useEffect, Suspense } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Import dynamique de ReactPlayer
const ReactPlayer = React.lazy(() => import('react-player'));

interface VideoPlayerProps {
  url: string;
  onError?: (error: any) => void;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, onError, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleReady = () => {
    setIsLoading(false);
  };

  const handleError = (error: any) => {
    setIsLoading(false);
    setHasError(true);
    if (onError) {
      onError(error);
    }
  };

  return (
    <div className={cn('relative w-full aspect-video', className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          <p className="text-sm text-gray-500">Erreur lors du chargement de la vidéo</p>
        </div>
      ) : (
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <ReactPlayer
            url={url}
            width="100%"
            height="100%"
            controls
            playing={false}
            onReady={handleReady}
            onError={handleError}
            className="rounded-md overflow-hidden"
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                }
              }
            }}
          />
        </Suspense>
      )}
    </div>
  );
};

export default VideoPlayer;
