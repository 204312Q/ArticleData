'use client';

import { useState, useEffect } from 'react';

import { SplashScreen } from './splash-screen';

// ----------------------------------------------------------------------

type BootSplashProps = {
  duration?: number;
};

export function BootSplash({ duration = 700 }: BootSplashProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [duration]);

  if (!visible) {
    return null;
  }

  return <SplashScreen />;
}
