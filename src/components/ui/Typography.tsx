import React, { ElementType, ReactNode } from 'react';
import { DS } from '@/constants/designSystem';
import { cn } from '@/lib/utils';

/**
 * Typography Components - Consistent text styling
 */

interface BaseTypographyProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  [key: string]: any;
}

interface HeadingProps extends BaseTypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Heading: React.FC<HeadingProps> = ({
  as: Component = 'h2',
  variant = 'h2',
  className = '',
  children,
  ...props
}) => {
  const variantClass = (DS.typography as any)[variant] || (DS.typography as any).h2;

  return (
    <Component className={cn(variantClass, className)} {...props}>
      {children}
    </Component>
  );
};

interface DisplayProps extends BaseTypographyProps {
  size?: 'xl' | 'lg' | 'md';
}

export const Display: React.FC<DisplayProps> = ({
  as: Component = 'h1',
  size = 'lg',
  className = '',
  children,
  ...props
}) => {
  const sizeClass = (DS.typography.display as any)[size] || (DS.typography.display as any).lg;

  return (
    <Component className={cn(sizeClass, className)} {...props}>
      {children}
    </Component>
  );
};

interface TextProps extends BaseTypographyProps {
  size?: 'lg' | 'md' | 'sm' | 'xs';
}

export const Text: React.FC<TextProps> = ({
  as: Component = 'p',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const sizeClass = (DS.typography.body as any)[size] || (DS.typography.body as any).md;

  return (
    <Component className={cn(sizeClass, className)} {...props}>
      {children}
    </Component>
  );
};

export const Lead: React.FC<BaseTypographyProps> = ({ className = '', children, ...props }) => {
  return (
    <p className={cn(DS.typography.lead, className)} {...props}>
      {children}
    </p>
  );
};

export const Subtitle: React.FC<BaseTypographyProps> = ({ className = '', children, ...props }) => {
  return (
    <p className={cn(DS.typography.subtitle, className)} {...props}>
      {children}
    </p>
  );
};

export const Caption: React.FC<BaseTypographyProps> = ({ className = '', children, ...props }) => {
  return (
    <p className={cn(DS.typography.caption, className)} {...props}>
      {children}
    </p>
  );
};

export default Heading;
