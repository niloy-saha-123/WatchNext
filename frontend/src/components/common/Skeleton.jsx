import React from 'react';

export const SkeletonLine = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const SkeletonPoster = ({ aspect = 'aspect-[2/3]', className = '' }) => (
  <div className={`animate-pulse ${aspect} bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg ${className}`} />
);

export const SkeletonCard = ({ variant = 'poster', withText = true }) => (
  <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
    {variant === 'poster' ? (
      <SkeletonPoster />
    ) : (
      <SkeletonPoster aspect="aspect-video" />
    )}
    {withText && (
      <div className="p-3 space-y-2">
        <SkeletonLine className="h-4 w-3/4" />
        <SkeletonLine className="h-3 w-1/2" />
      </div>
    )}
  </div>
);

export const SkeletonGrid = ({ count = 8, variant = 'poster' }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
    {Array.from({ length: count }).map((_, idx) => (
      <SkeletonCard key={idx} variant={variant} />
    ))}
  </div>
);

export default { SkeletonLine, SkeletonPoster, SkeletonCard, SkeletonGrid };


