import React, { ReactNode } from 'react';
import { DS } from '@/constants/designSystem';
import { cn } from '@/lib/utils';

/**
 * Container Component - Consistent max-width containers
 */

interface ContainerProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padded?: boolean;
  className?: string;
  [key: string]: any;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  padded = true,
  className = '',
  ...props
}) => {
  const containerClass = padded 
    ? (DS.containers as any)[`${size}Padded`] || (DS.containers as any).lgPadded
    : (DS.containers as any)[size] || (DS.containers as any).lg;

  return (
    <div className={cn(containerClass, className)} {...props}>
      {children}
    </div>
  );
};

/**
 * Section Component - Consistent section spacing
 */

interface SectionProps {
  children: ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  [key: string]: any;
}

export const Section: React.FC<SectionProps> = ({
  children,
  spacing = 'md',
  className = '',
  ...props
}) => {
  const spacingClass = (DS.spacing.section as any)[spacing] || (DS.spacing.section as any).md;

  return (
    <section className={cn(spacingClass, className)} {...props}>
      {children}
    </section>
  );
};

/**
 * Combined Section with Container
 */

interface SectionContainerProps extends SectionProps {
  containerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  sectionSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  sectionSpacing = 'md',
  containerSize = 'lg',
  className = '',
  ...props
}) => {
  return (
    <Section spacing={sectionSpacing} className={className} {...props}>
      <Container size={containerSize}>
        {children}
      </Container>
    </Section>
  );
};

export default Container;
