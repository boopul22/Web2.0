import React from 'react';

export const IMAGE_DIMENSIONS = {
  thumbnail: { width: 200, height: 200 },
  preview: { width: 600, height: 400 },
  full: { width: 1200, height: 800 }
};

export const getImageUrl = (url: string, size: keyof typeof IMAGE_DIMENSIONS = 'full'): string => {
  if (!url) return '/placeholder-image.jpg';
  
  // If the URL is already a full URL, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, assume it's a relative path and return it as is
  return url;
};

export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const img = event.currentTarget;
  img.src = '/placeholder-image.jpg';
  img.onerror = null; // Prevents infinite loop if placeholder also fails
}; 