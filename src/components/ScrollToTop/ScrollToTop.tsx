'use client';

import { IconButton } from '@radix-ui/themes';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './ScrollToTop.module.scss';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <IconButton
      className={styles.scrollTop}
      size="3"
      variant="solid"
      onClick={scrollToTop}
      aria-label="Наверх"
    >
      <ArrowUp size={20} />
    </IconButton>
  );
}
