'use client'

export default function FriendSkeleton(){
    return (
        <div className="skeleton-friend-item">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-details">
            <div className="skeleton-line name"></div>
          </div>
          <div className="skeleton-button"></div>
        </div>
      );

}