import { useEffect, useRef, useState } from 'react';

interface TiltSettings {
  maxTilt: number;
  perspective: number;
  scale: number;
  speed: number;
}

export function useTiltEffect(settings: Partial<TiltSettings> = {}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const defaultSettings: TiltSettings = {
    maxTilt: 15,
    perspective: 1000,
    scale: 1.05,
    speed: 300,
    ...settings,
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / (rect.height / 2)) * -defaultSettings.maxTilt;
      const rotateY = (mouseX / (rect.width / 2)) * defaultSettings.maxTilt;

      setTransform(`
        perspective(${defaultSettings.perspective}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(${defaultSettings.scale}, ${defaultSettings.scale}, ${defaultSettings.scale})
      `);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setTransform('');
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered, defaultSettings]);

  return {
    elementRef,
    transform,
    isHovered,
  };
}
