import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { FaWordpress } from 'react-icons/fa'; // Import FaWordpress from react-icons/fa
import { cn } from '@/lib/utils';

type PlatformType = 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'wordpress';

interface PlatformIconProps {
  platform: PlatformType;
  size?: number;
  className?: string;
}

const PlatformIcon: React.FC<PlatformIconProps> = ({ 
  platform, 
  size = 20, 
  className 
}) => {
  const iconProps = {
    size,
    className: cn('transition-all duration-300', className),
  };

  switch (platform) {
    case 'linkedin':
      return <Linkedin {...iconProps} className={cn('text-socialBlue', className)} />;
    case 'instagram':
      return <Instagram {...iconProps} className={cn('text-socialBlue-instagram', className)} />;
    case 'twitter':
      return <Twitter {...iconProps} className={cn('text-socialBlue-twitter', className)} />;
    case 'facebook':
      return <Facebook {...iconProps} className={cn('text-socialBlue-facebook', className)} />;
    case 'wordpress':
      // Utiliser l'icône FaWordpress de react-icons à la place de FileCode
      return <FaWordpress {...iconProps} className={cn('text-[#21759b]', className)} />; // Couleur officielle WordPress #21759b
    default:
      return null;
  }
};

export default PlatformIcon;
