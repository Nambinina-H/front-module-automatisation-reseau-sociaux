
import React, { useState, Suspense, useEffect, useRef } from 'react';
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
  const playerRef = useRef<any>(null);

  // Détermine si l'URL est une URL externe (commençant par http ou https)
  const isExternalUrl = url.startsWith('http://') || url.startsWith('https://');

  useEffect(() => {
    if (!isExternalUrl) return;

    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching video from URL:", url);
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        console.log("Created blob URL:", blobUrl);
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
  }, [url, isExternalUrl]);

  const handleReady = () => {
    setIsLoading(false);
    if (onReady) {
      onReady();
    }
  };

  const handleError = (error: any) => {
    console.error('Erreur de lecture vidéo:', error);
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
            ref={playerRef}
            url={blobUrl || url}
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
