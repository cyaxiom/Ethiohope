import React from 'react';
import { DS } from '@/constants/designSystem';
import { cn } from '@/lib/utils';

/**
 * Container Component - Consistent max-width containers
 * 
 * @param {string} size - xs | sm | md | lg | xl | full
 * @param {boolean} padded - Include horizontal padding
 */
export const Container = ({
  children,
  size = 'lg',
  padded = true,
  className = '',
  ...props
}) => {
  const containerClass = padded 
    ? DS.containers[`${size}Padded`] || DS.containers.lgPadded
    : DS.containers[size] || DS.containers.lg;

  return (
    <div className={cn(containerClass, className)} {...props}>
      {children}
    </div>
  );
};

/**
 * Section Component - Consistent section spacing
 * 
 * @param {string} spacing - xs | sm | md | lg | xl
 */
export const Section = ({
  children,
  spacing = 'md',
  className = '',
  ...props
}) => {
  const spacingClass = DS.spacing.section[spacing];

  return (
    <section className={cn(spacingClass, className)} {...props}>
      {children}
    </section>
  );
};

/**
 * Combined Section with Container
 */
export const SectionContainer = ({
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
