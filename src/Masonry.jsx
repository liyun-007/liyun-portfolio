import { useEffect, useRef, useState } from 'react';
import './Masonry.css';

export default function Masonry({ items, onPreview, hoverScale = 0.95 }) {
  const listRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!listRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(listRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={listRef}
      className={`masonry-list${isVisible ? ' masonry-visible' : ''}`}
      style={{ '--hover-scale': hoverScale }}
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          className={`work-card masonry-work-card work-card-${item.size}`}
          type="button"
          onClick={() => onPreview(item.source)}
          aria-label={`预览 ${item.title}`}
          style={{
            '--masonry-delay': `${Math.min(index, 12) * 68}ms`,
            aspectRatio: item.ratio,
          }}
        >
          <span className="masonry-img" style={{ backgroundImage: `url(${item.img})` }} />
        </button>
      ))}
    </div>
  );
}
