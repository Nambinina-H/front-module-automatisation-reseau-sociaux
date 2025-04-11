import React, { useState, Suspense, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Import dynamique de ReactPlayer
const ReactPlayer = React.lazy(() => import('react-player'));

interface VideoPlayerProps {
  url: string;
  onError?: (error: any) => void;
  className?: string;
  onReady?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, onError, className, onReady }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setBlobUrl(blobUrl);
      } catch (error) {
        console.error('Erreur lors du chargement de la vidéo:', error);
        setHasError(true);
        if (onError) onError(error);
      }
    };

    fetchVideo();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [url]);

  const handleReady = () => {
    setIsLoading(false);
    if (onReady) {
      onReady();
    }
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
      {isLoading && !blobUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          <p className="text-sm text-gray-500">Erreur lors du chargement de la vidéo</p>
        </div>
      ) : blobUrl && (
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <ReactPlayer
            url={blobUrl}
            width="100%"
            height="100%"
            controls={true}
            playing={false}
            pip={false}
            onReady={handleReady}
            onError={handleError}
            className="rounded-md overflow-hidden"
          />
        </Suspense>
      )}
    </div>
  );
};

export default VideoPlayer;
