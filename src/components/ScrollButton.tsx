import { useState, useEffect } from 'react';
import { KeyboardArrowUp } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    });
  }, []);

  return (
    <>
      {visible && (
        <IconButton onClick={scrollToTop} className='fixed bottom-4 right-4' color='primary'>
          <KeyboardArrowUp />
        </IconButton>
      )}
    </>
  );
};

export default ScrollButton;
