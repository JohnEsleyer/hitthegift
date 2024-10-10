'use client'

export default function EventSkeleton(){
    return (
        <div className="flex gap-2 items-center justify-between p-2 bg-gray-100 rounded-2xl m-2">
      {/* Skeleton for the date circle */}
      <div
        className="skeleton-circle"
        style={{ fontSize: 15, width: 30, height: 30 }}
      ></div>

      {/* Skeleton for the title and avatars */}
      <div style={{ width: 200 }} className="flex">
        <div className="skeleton-line" style={{ width: 100 }}></div>
        <div className="flex-1 flex justify-end gap-2">
          {/* Skeleton for avatars */}
          <div className="skeleton-avatar"></div>
          <div className="skeleton-avatar"></div>
          <div className="skeleton-line" style={{ width: 20 }}></div> {/* For +N */}
        </div>
      </div>
    </div>
    )
}