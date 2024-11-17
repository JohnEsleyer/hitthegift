"use client"



export default function InboxSkeleton() {
    return (
        <ul 
        style={{ height: 300 }} 
        className="space-y-4 overflow-auto p-2"
      >
        {[...Array(5)].map((_, index) => (
          <div 
            key={index} 
            className="flex items-center w-full animate-pulse"
          >
            <div className="bg-gray-300 rounded-full w-10 h-10 mr-4"></div>
            <div className="flex-1 space-y-2">
              <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
              <div className="bg-gray-300 h-3 w-1/2 rounded"></div>
            </div>
          </div>
        ))}
      </ul>
    )
}