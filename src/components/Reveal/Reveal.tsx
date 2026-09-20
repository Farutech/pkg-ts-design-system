import React, { useEffect, useRef, useState } from 'react';

/**
 * Reveal: animacion de entrada on-scroll (viene de apps/frontend).
 * IntersectionObserver nativo — elimina la dependencia de framer-motion
 * que tenia el original (menos peso para website; doc 08 PERFORMANCE).
 */
export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() =>
    typeof IntersectionObserver === 'undefined' ? true : false,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      // SSR / entorno sin observer: el estado inicial ya deja el contenido visible.
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible((prev) => (prev ? prev : true));
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // El observer escribe una sola vez al volverse visible; no hay cascada.
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, []);

  return (
    <div
      ref={ref}
      className={`ft-reveal${visible ? ' ft-reveal--visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
