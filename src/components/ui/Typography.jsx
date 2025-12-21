import React from 'react';
import { DS } from '@/constants/designSystem';
import { cn } from '@/lib/utils';

/**
 * Typography Components - Consistent text styling
 */

export const Heading = ({
  as: Component = 'h2',
  variant = 'h2',
  className = '',
  children,
  ...props
}) => {
  const variantClass = DS.typography[variant] || DS.typography.h2;

  return (
    <Component className={cn(variantClass, className)} {...props}>
      {children}
    </Component>
  );
};

export const Display = ({
  as: Component = 'h1',
  size = 'lg',
  className = '',
  children,
  ...props
}) => {
  const sizeClass = DS.typography.display[size] || DS.typography.display.lg;

  return (
    <Component className={cn(sizeClass, className)} {...props}>
      {children}
    </Component>
  );
};

export const Text = ({
  as: Component = 'p',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const sizeClass = DS.typography.body[size] || DS.typography.body.md;

  return (
    <Component className={cn(sizeClass, className)} {...props}>
      {children}
    </Component>
  );
};

export const Lead = ({ className = '', children, ...props }) => {
  return (
    <p className={cn(DS.typography.lead, className)} {...props}>
      {children}
    </p>
  );
};

export const Subtitle = ({ className = '', children, ...props }) => {
  return (
    <p className={cn(DS.typography.subtitle, className)} {...props}>
      {children}
    </p>
  );
};

export const Caption = ({ className = '', children, ...props }) => {
  return (
    <p className={cn(DS.typography.caption, className)} {...props}>
      {children}
    </p>
  );
};

export default Heading;
