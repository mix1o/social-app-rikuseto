import { useEffect } from 'react';

export default function useIntersectionObserver({
  target,
  onIntersect,
  root,
  rootMargin = '5px', //margin around root element can be similar to css properties
  enabled = true,
  threshold = 0.1, // between 0 and 1 or array of numbers [0,0.25,0.7,1]
}: {
  onIntersect: () => void;
  target: any; //ref object
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
  root?: Element | Document | null | undefined | any;
}) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(entry => {
          entry.isIntersecting && onIntersect();
        }),

      {
        root: root && root.current,
        rootMargin,
        threshold,
      }
    );

    const el = target && target.current;

    if (!el) {
      return;
    }

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [target.current, enabled]);
}
