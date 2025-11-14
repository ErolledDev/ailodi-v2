'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function PageProgressBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    const startProgress = () => {
      setIsLoading(true);
      setProgress(0);

      // Simulate progress with realistic timing
      const progressSteps = [
        { progress: 20, delay: 100 },
        { progress: 40, delay: 200 },
        { progress: 60, delay: 150 },
        { progress: 80, delay: 100 },
        { progress: 95, delay: 50 },
        { progress: 100, delay: 100 },
      ];

      let currentStep = 0;
      
      const runProgressStep = () => {
        if (currentStep < progressSteps.length) {
          const step = progressSteps[currentStep];
          progressTimer = setTimeout(() => {
            setProgress(step.progress);
            currentStep++;
            runProgressStep();
          }, step.delay);
        } else {
          // Complete the progress and hide after a short delay
          completeTimer = setTimeout(() => {
            setIsLoading(false);
            setProgress(0);
          }, 200);
        }
      };

      runProgressStep();
    };

    // Start progress when pathname changes
    startProgress();

    // Cleanup function
    return () => {
      if (progressTimer) clearTimeout(progressTimer);
      if (completeTimer) clearTimeout(completeTimer);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5">
      <div
        className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-300 ease-out shadow-sm"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
        }}
      >
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
      </div>
    </div>
  );
}