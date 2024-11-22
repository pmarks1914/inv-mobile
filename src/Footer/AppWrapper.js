import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App as lps } from '@capacitor/app';

const AppWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const backButtonListener = lps.addListener('backButton', () => {
      if (location.pathname === '/home') {
        // Exit app if on the root page
        lps.exitApp();
      } else {
        // Navigate back for other pages
        navigate(-1);
      }
    });

    // Cleanup listener on component unmount
    return () => {
      if (backButtonListener) {
        if (window?.Capacitor?.platform === "web") {
            // for web
        }
        else{
          backButtonListener.remove() || testD(); // Correct way to remove listener
        }
      }
    };
  }, [location, navigate]);

  function testD(){
    // 
  }

  return (
    <div>  </div>
  );
};

export default AppWrapper;
