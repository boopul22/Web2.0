import React from 'react';

export const IMAGE_DIMENSIONS = {
  width: 800,
  height: 600
};

export function getImageUrl(url: string | null): string {
  if (!url) return '/images/placeholder.jpg';
  return url;
}

export function handleImageError(e: { target: HTMLImageElement }) {
  e.target.src = '/images/placeholder.jpg';
} 