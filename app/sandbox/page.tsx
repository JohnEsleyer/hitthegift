"use client";

import { useState } from "react";
import getProductDetails from "../actions/amazon/getProductDetails";

export default function Sandbox() {
  const [url, setUrl] = useState('');
  const [asin, setAsin] = useState<string | null>(null);
  const [productTitle, setProductTitle] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productPhoto, setProductPhoto] = useState('');

  const extractASIN = (url: string): string | null => {
    const match = url.match(/\/dp\/([A-Z0-9]{10})(\/|\?|$)/);
    return match ? match[1] : null;
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    setAsin(extractASIN(event.target.value));
  };

  const handleFetchProductDetail = async () => {
    if (asin){
      try{
        const res = await getProductDetails(asin);
        if (res){
          console.log('success');
          setProductTitle(res.title);
          setProductDescription(res.description);
          setProductPrice(res.price);
          setProductPhoto(res.imageUrl);
        }
      }catch(e){
        console.log(e);
      }
    }
  }  
  return (
    <div>
      <input 
        type="text" 
        placeholder="Enter Amazon product URL" 
        value={url} 
        onChange={handleUrlChange} 
      />
      {asin && (
        <div>
          <p>Extracted ASIN: {asin}</p>
        </div>
      )}
      <button className="bg-green-300 border rounded-full" onClick={handleFetchProductDetail}>Fetch Amazon Product Details</button>
      <p>Product Title: {productTitle}</p>
      <p>Product Details: {productDescription}</p>
      <p>Product Price: {productPrice}</p>
      <img src={productPhoto} alt=""/>
    </div>
  );
}
