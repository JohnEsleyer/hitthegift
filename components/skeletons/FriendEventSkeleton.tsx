'use client'

import '@/styles/skeletons.css';

export default function FriendEventSkeleton(){
    return (
        <div className="skeleton-event-item">
      <div className="skeleton-circle"></div>
      <div className="skeleton-text"></div>
    </div>
    )
}