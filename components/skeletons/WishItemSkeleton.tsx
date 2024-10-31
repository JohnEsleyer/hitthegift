'use client'



export default function WishItemSkeleton(){
    return (  
     <div
     style={{ width: 200 }}
     className="bg-white p-4 rounded-xl border border-slate-300"
   >
     {/* Skeleton for product image */}
     <div className="skeleton-box" style={{ height: 150, width: '100%' }}></div>
   
     {/* Skeleton for product name */}
     <div className="skeleton-line mt-2" style={{ width: '70%', height: '12px' }}></div>
   
     {/* Skeleton for product price */}
     <div className="skeleton-line mt-2" style={{ width: '30%', height: '16px' }}></div>
   
     {/* Skeleton for product description (multiple lines) */}
     <div className="skeleton-line mt-2" style={{ width: '90%', height: '12px' }}></div>
     <div className="skeleton-line mt-1" style={{ width: '85%', height: '12px' }}></div>
     <div className="skeleton-line mt-1" style={{ width: '80%', height: '12px' }}></div>
     <div className="skeleton-line mt-1" style={{ width: '75%', height: '12px' }}></div>
   
     {/* Skeleton for the button */}
     <div className="skeleton-box mt-2" style={{ width: '50%', height: '32px' }}></div>
   </div>
   )
   }