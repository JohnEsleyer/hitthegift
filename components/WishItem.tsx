"use client";

interface WishItemProps {
  productName: string;
  price: string;
  description: string;
  productUrl: string;
}

export default function WishItem({
  productName,
  price,
  description,
  productUrl,
}: WishItemProps) {
  return (
    <div
      style={{ width: 200 }}
      className="p-4 rounded-xl border border-slate-300"
    >
      <div style={{ height: 150 }} className=" w-full bg-slate-300"></div>
      <p style={{fontSize: 12}} className="flex justisfy-center mt-2">{productName}</p>
      <p className="font-bold">${price}</p>
      <p className="line-clamp-6 text-xs mt-2 h-24 ">{description}</p>
      <div className="flex justify-center items-center">
      <a href={productUrl} target={"_blank"} className="bg-blue-500 text-white p-2 pl-4 pr-4 rounded-2xl mt-2">
        Buy
      </a>
      </div>
    </div>
  );
}
