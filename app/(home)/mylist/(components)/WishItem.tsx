"use client";

interface WishItemProps {
  productName: string;
  price: string;
  description: string;
}

export default function WishItem({
  productName,
  price,
  description,
}: WishItemProps) {
  return (
    <div
      style={{ width: 200 }}
      className="p-4 rounded-xl border border-slate-300"
    >
      <div style={{ height: 150 }} className=" w-full bg-slate-300"></div>
      <p className="flex justisfy-center mt-2">{productName}</p>
      <p className="font-bold">{price}</p>
      <p className="text-xs mt-2 h-24 overflow-auto">{description}</p>
    </div>
  );
}
