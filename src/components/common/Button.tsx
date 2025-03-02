
import React from 'react';
import { cn } from '@/lib/utils';
import { Button as ShadcnButton } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary' | 'accent';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  loading = false,
  disabled,
  iconLeft,
  iconRight,
  children,
  className,
  ...props
}) => {
  // Map our custom variants to shadcn variants
  let mappedVariant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' = 'default';
  
  if (variant === 'primary') {
    mappedVariant = 'default';
  } else if (variant === 'accent') {
    mappedVariant = 'secondary';
  } else if (['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'].includes(variant)) {
    mappedVariant = variant as any;
  }

  return (
    <ShadcnButton
      variant={mappedVariant}
      size={size}
      disabled={disabled || loading}
      className={cn(
        'font-medium button-effect',
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        variant === 'accent' && 'bg-accent text-accent-foreground hover:bg-accent/90',
        loading && 'cursor-wait',
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!loading && iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {!loading && iconRight && <span className="ml-2">{iconRight}</span>}
    </ShadcnButton>
  );
};

export default Button;
