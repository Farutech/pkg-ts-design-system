import React from 'react';
import './Content.css';

/** Eyebrow: etiqueta corta sobre headings (viene de apps/frontend). */
export interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return <span className={`ft-eyebrow${className ? ` ${className}` : ''}`}>{children}</span>;
}

/** SectionHeading: par eyebrow + titulo + descripcion (apps/frontend). */
export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={`ft-section-heading ft-section-heading--${align}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="ft-section-heading__title">{title}</h2>
      {description && <p className="ft-section-heading__desc">{description}</p>}
    </div>
  );
}
