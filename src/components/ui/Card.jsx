import React from 'react';
import { DS } from '@/constants/designSystem';
import { cn } from '@/lib/utils';

/**
 * Card Component - Consistent card wrapper
 * 
 * @param {string} variant - base | elevated | flat | outlined | ghost
 * @param {string} padding - sm | md | lg
 * @param {boolean} hoverable - Enable hover effects
 * @param {boolean} interactive - Enable cursor pointer and stronger hover
 */
export const Card = ({
  children,
  variant = 'base',
  padding = 'md',
  hoverable = false,
  interactive = false,
  className = '',
  ...props
}) => {
  const baseClasses = DS.cards[variant] || DS.cards.base;
  const paddingClasses = DS.cards.padding[padding];
  const hoverClasses = hoverable ? DS.cards.hover : '';
  const interactiveClasses = interactive ? `${DS.cards.active} cursor-pointer` : '';

  return (
    <div
      className={cn(baseClasses, paddingClasses, hoverClasses, interactiveClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card with header and content sections
 */
export const CardWithHeader = ({
  title,
  description,
  children,
  headerAction,
  ...cardProps
}) => {
  return (
    <Card {...cardProps}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className={DS.typography.h4}>{title}</h3>
          {headerAction}
        </div>
        {description && (
          <p className={DS.typography.caption}>{description}</p>
        )}
      </div>
      <div>{children}</div>
    </Card>
  );
};

export default Card;
