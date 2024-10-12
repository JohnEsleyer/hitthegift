'use client'

export default function ProfileSkeleton(){

    return (<div className="w-full flex flex-col items-center justify-center">
        {/* Loading state for saving */}
        <div className="flex flex-col items-left w-full h-8">
          {/* Placeholder for the saving animation */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            <span className="text-xs flex ml-2 bg-gray-300 w-12 h-4 animate-pulse"></span>
          </div>
        </div>
      
        {/* Loading state for the UserProfile */}
        <div className="w-28 h-28 rounded-full bg-gray-300 mt-4 animate-pulse"></div>
      
        {/* Loading state for first name input */}
        <div className="mt-2 flex justify-center">
          <div className="w-48 h-10 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
      
        {/* Loading state for email input */}
        <div className="mt-2">
          <div className="w-48 h-6 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
      
        {/* Loading state for date of birth */}
        <div className="w-full mt-4">
          <p className="w-20 h-4 bg-gray-300 animate-pulse"></p>
          <div className="w-full h-10 mt-2 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
      </div>
      );
}