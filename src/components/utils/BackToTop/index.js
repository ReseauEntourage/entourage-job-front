import React, { useState, useEffect } from 'react';
import { IconNoSSR } from 'src/components/utils/Icon';
import { StyledBackToTop } from 'src/components/utils/BackToTop/styles';

const BackToTop = () => {
  const [iconClass, setIconClass] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    }
  }, []);

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  };
  return (
    <StyledBackToTop className={iconClass} onClick={handleClick}>
      <IconNoSSR name="chevron-white" style={{ height: 20 }} />
    </StyledBackToTop>
  );
};

export default BackToTop;
