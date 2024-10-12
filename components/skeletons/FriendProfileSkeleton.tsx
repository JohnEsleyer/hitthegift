'use client'

export default function FriendProfileSkeleton(){
    return (
        <div className="mt-2 p-2 border border-gray-200 rounded-2xl animate-pulse">
        {/** Friend's profile */}
        <div className="flex p-2">
            <div className="flex items-center">
                <div className="rounded-full bg-gray-300 h-11 w-11"></div> {/* Avatar placeholder */}
            </div>
            <div className="p-2">
                <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div> {/* Name placeholder */}
                <div className="h-3 bg-gray-300 rounded w-24"></div> {/* Email placeholder */}
            </div>
        </div>
        <span className="text-xl font-bold bg-gray-300 rounded w-40 h-6 mb-2"></span> {/* Interests header placeholder */}
        <div style={{ height: 120, width: 260 }} className="shadow-md border rounded-2xl p-2">
            <div className="h-full bg-gray-300 rounded"></div> {/* Hobbies info placeholder */}
        </div>
        <div style={{ height: 100 }}></div>
        <span className="bg-gray-300 rounded w-72 h-6 mb-2"></span> {/* Shared list header placeholder */}
        <div className="flex space-x-2">
            {Array.from({ length: 3 }).map((_, index) => (  // Adjust the length based on expected number of friends
                <div key={index} className="rounded-full bg-gray-300 h-11 w-11"></div> // Friend avatar placeholders
            ))}
        </div>
    </div>
    );
}