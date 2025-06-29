import { useState, useEffect, type RefObject } from "react";

export function useInView(
  ref: RefObject<HTMLElement | null> // allow null
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}
