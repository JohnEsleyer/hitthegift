'use client'
import '@/styles/skeletons.css';

export default function EventSkeleton(){
    return (
      <div className="rounded-2xl flex gap-2 items-center justify-between p-2 bg-gray-100 rounded-2xl m-1 animate-pulse">
      {/* Skeleton for the date circle */}
      <div
          className="skeleton-circle bg-[#a3a2a2]"
          style={{ width: 30, height: 30, borderRadius: '50%' }}
      ></div>

      {/* Skeleton for the title and avatars */}
      <div className="flex-1 flex">
          <div className="skeleton-line bg-[#a3a2a2]" style={{ width: 100, height: 15, borderRadius: '4px' }}></div>
          <div className="flex-1 flex justify-end items-center gap-2">
              {/* Skeleton for avatars */}
              <div className="skeleton-avatar bg-[#a3a2a2]" style={{ width: 30, height: 30, borderRadius: '50%' }}></div>
              <div className="skeleton-avatar bg-[#a3a2a2]" style={{ width: 30, height: 30, borderRadius: '50%' }}></div>
              <div className="skeleton-line bg-[#a3a2a2]" style={{ width: 20, height: 15, borderRadius: '4px' }}></div> {/* For +N */}
          </div>
      </div>
  </div>
    )
}