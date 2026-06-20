import React from 'react';

const NailItemSkeleton: React.FC = () => {
  return (
    <li className="nail-skeleton-card" aria-hidden="true">
      <div className="nail-skeleton-thumb shimmer" />
      <div className="nail-skeleton-body">
        <div className="nail-skeleton-title shimmer" />
        <div className="nail-skeleton-tags">
          <div className="nail-skeleton-tag shimmer" />
          <div className="nail-skeleton-tag shimmer" />
        </div>
        <div className="nail-skeleton-date shimmer" />
      </div>
    </li>
  );
};

export default NailItemSkeleton;
