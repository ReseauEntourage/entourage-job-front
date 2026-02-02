import React, { useState, useEffect } from 'react';
import { StyledBackToTop } from '@/src/components/ui/BackToTop/BackToTop.styles';

import { LucidIcon } from '../Icons/LucidIcon';
export const BackToTop = () => {
  const [iconClass, setIconClass] = useState('');
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIconClass('visible');
      } else {
        setIconClass('');
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };
  return (
    <StyledBackToTop className={iconClass} onClick={handleClick}>
      <LucidIcon name="ChevronUp" size={30} />
    </StyledBackToTop>
  );
};
