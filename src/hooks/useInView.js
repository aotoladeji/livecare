import { useEffect, useRef, useState } from 'react';

export default function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const { threshold = 0.12, root = null, rootMargin = '0px' } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el); } },
      { threshold, root, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin]);

  return [ref, inView];
}
