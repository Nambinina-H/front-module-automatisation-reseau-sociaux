
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge as ShadcnBadge } from '@/components/ui/badge';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'linkedin' | 'instagram' | 'twitter' | 'facebook';
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className,
  ...props
}) => {
  // Custom social platform variants
  const socialVariants = {
    linkedin: 'bg-socialBlue text-white hover:bg-socialBlue/80',
    instagram: 'bg-socialBlue-instagram text-white hover:bg-socialBlue-instagram/80',
    twitter: 'bg-socialBlue-twitter text-white hover:bg-socialBlue-twitter/80',
    facebook: 'bg-socialBlue-facebook text-white hover:bg-socialBlue-facebook/80',
  };

  // Standard variants are handled directly by shadcn
  const isSocialVariant = ['linkedin', 'instagram', 'twitter', 'facebook'].includes(variant);
  const standardVariant = isSocialVariant ? 'default' : variant;

  return (
    <ShadcnBadge
      variant={standardVariant as any}
      className={cn(
        'font-medium transition-all duration-300',
        isSocialVariant && socialVariants[variant as keyof typeof socialVariants],
        className
      )}
      {...props}
    >
      {children}
    </ShadcnBadge>
  );
};

export default Badge;
