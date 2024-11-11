"use client";

import { createProduct } from "@/app/actions/products/createProduct";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currencies } from "./constants";
import Image from "next/image";
import Loading from "/public/loading.svg";
import ProductImageUploader from "@/components/ProductImageUploader";
import { v4 as uuidv4 } from "uuid";
import { insertMyListProduct } from "@/lib/features/mylist";
import { handleBase64ToFormData } from "@/utils/base64ToFormData";
import uploadProductImage from "@/app/actions/s3/uploadProductImage";
import { createObjectId } from "@/app/actions/mongoActions";
import CountryFlag from "./CountryFlag";
import { extractASIN } from "./functions";
import getProductDetails from "@/app/actions/amazon/getProductDetails";
import { updateAmazonImageUrl, updateBase64Image } from "@/lib/features/productImageUpload";

export default function AddProductPopup() {
  const dispatch = useDispatch();
  const [productTitle, setProductTitle] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [price, setPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.userData.id);
  const selectedImage = useSelector(
    (state: RootState) => state.productImageUpload.base64Image
  );
 
  // States about product auto fill
  const [autoFill, setAutoFill] = useState(true);
  const [isAutoFillPending, startAutoFillTransition] = useTransition();
  const [productImageUrl, setProductImageUrl] = useState('');
  const [didInitialize, setDidInitialize] = useState(false);

  // States about checking for empty inputs 
  const [emptyInputs, setEmptyInputs] = useState<string[]>([]);

  const clickAddProduct = async () => {
    let emptyCounter = 0;
    let emptyInput = ''; // title, price, description
    setEmptyInputs([]);


    // Check if product title, price, and description are empty
    if (productTitle == ''){
      setEmptyInputs((prev) => [...prev, 'title']);
      emptyInput = 'title';
      emptyCounter++;
    }
    if (price == ''){
      setEmptyInputs((prev) => [...prev, 'price']);
      emptyInput = 'price';
      emptyCounter++;
    }
    if (productDescription == ''){
      setEmptyInputs((prev) => [...prev, 'description']);
      emptyInput = 'description'
      emptyCounter++;
    }

    if (emptyCounter >= 1){
      return;
    }
    
    setIsLoading(true);
    try {
      const productId = await createObjectId();
      // Function to create a product
      const createNewProduct = async (imageUrl: string) => {
        console.log("Creating product...");
        const responseData = await createProduct({
          _id: productId.toString(),
          userId: userId,
          title: productTitle,
          currency: currency || '',
          price: price || '',
          productUrl: productUrl || '',
          imageUrl: productImageUrl !== '' ?  productImageUrl : imageUrl, // if image was not auto filled then use the image url of the uploaded image 
          description: productDescription || '',
        });
    
        if (responseData.data) {
          console.log(responseData.message);
          dispatch(insertMyListProduct(responseData.data));
        } else {
          console.error('Failed to create product', responseData);
        }
      };
    
      // Check if user has uploaded an image
      // Only upload if image was not filled by auto fill.
      if (selectedImage.length > 0) {
        // Convert base64 file string to FormData
        const formData = handleBase64ToFormData(
          selectedImage,
          "productImage.webp"
        );
    
        // Upload the image to S3
        const result = await uploadProductImage(formData, productId.toString());
    
        // Create a product with the uploaded image URL
        await createNewProduct(result.url || '');
      } else {
        // Create a product without an image
        await createNewProduct('');
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
    

    setTimeout(() => {
      dispatch(updateCurrentPopup("none"));
      setIsLoading(false);
    }, 3000);
  };


  // Initialization
  useEffect(() => {
    dispatch(updateAmazonImageUrl(''));

    setDidInitialize(true);
  }, []);

  // This useEffect triggers when product URL is updated and auto fill is enabled.
  useEffect(() => {
    setEmptyInputs([]);
    if (autoFill && didInitialize){
      console.log(`productUrl: ${productUrl}`);
      const ASIN = extractASIN(productUrl);
      startAutoFillTransition(async ()=> {
        console.log('pending Auto fill')
        console.log(`asin: ${ASIN}`);
        if (ASIN){
          console.log(`asin: true`);
          try{
            const res = await getProductDetails(ASIN);
            if (res){
              console.log('success');
              setProductTitle(res.title);
              setProductDescription(res.description);
              console.log(`setPrice: ${res.price}`);
              setPrice(res.price);
              setProductImageUrl(res.imageUrl);
              dispatch(updateAmazonImageUrl(res.imageUrl));
            }
            console.log('success');
            // Reset Image Upload state
            dispatch(updateBase64Image(''));
          }catch(e){
            console.log('failed');
            console.log(e);
          }
        }
      });
    }
  },[autoFill, productUrl]);

  return (
    <div
      style={{ width: 500, height: 630, marginTop: 50 }}
      className="pt-4 pr-1 overflow-auto hide-scrollbar bg-white rounded-2xl border-2 border-slate-400"
    >
      <div className="h-full">
        {/*Image of the Product */}
        <div className="flex justify-center ">
          <ProductImageUploader
            width={150}
            height={150}
            productId={(() => {
              return uuidv4();
            })()}
            onUpload={() => {
              setProductImageUrl('');
            }}
          />
        </div>

        {/*Title input */}
        <div className="mt-4 flex justify-center ">
          <div className="flex gap-2">
            <div>
              <p>Title</p>
              <div  style={{width: 270, height: 40}} className={`${isAutoFillPending && 'glowing-border'}`}>
              <input
                className={`rounded-full p-2 pl-4 border ${emptyInputs.includes('title') ? 'border-red-500' : 'border-slate-400' } `}
                placeholder={"Product name"}
                value={productTitle}
                onChange={(e) => {
                  setProductTitle(e.target.value);
                }}
              />
              </div>
            </div>
            <div className="flex flex-col">
              <label>Price</label>
              <div className={`flex rounded-full bg-white border ${emptyInputs.includes('price') ? 'border-red-500' : 'border-slate-400' } ${isAutoFillPending && 'glowing-border'}`}>
                <input
                  style={{ width: 100 }}
                  className="border-slate-400 border-r rounded-l-full pl-2 "
                  placeholder="1.00"
                  type="number"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />

                <div className="relative p-2 flex items-center ">
                  <button
                    className=" "
                    onClick={() => {
                      setShowCurrencyOptions((prev) => !prev);
                    }}
                  >
                    {currency}
                  </button>
                  {showCurrencyOptions && (
                    <ul
                      style={{ zIndex: 100,width:80, top: 30, right: 1 }}
                      className="flex flex-col h-52 p-2 overflow-auto absolute mt-2 bg-white rounded shadow-md"
                    >
                      {currencies.map((currency) => (
                        <button
                        className="flex justify-between hover:bg-gray-200 w-full"
                          onClick={() => {
                            setCurrency(currency);
                            setShowCurrencyOptions(false);
                          }}
                          key={currency}
                        >
                            <CountryFlag currency={currency}/> <span>{currency}</span>
                        </button>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Product URL input */}
        <div className="mt-4 flex justify-center ">
          <div>
            <p>Product URL</p>
            <input
              style={{ width: 430 }}
              className={` border border-slate-400 rounded-full p-2 pl-4`}
              placeholder={"Product URL"}
              value={productUrl}
              onChange={(e) => {
                console.log(e.target.value.length);
                setProductUrl(e.target.value);
              }}
            />
          </div>
        </div>
          
        {/** Auto fill product details */}
        <div className="mt-4 flex justify-center">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p>Auto Fill Product Details</p>
              <p style={{width: 350}} className="text-gray-500 ">
                Fill product title, description, and image when product URL is given.
              </p>
            </div>
            <label className="switch">
            <input
                type="checkbox"
                checked={autoFill}
                onChange={(e) => {
                  setAutoFill(e.target.checked);
                }}
              />
              
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        {/* Description  */}
        <div className="mt-4 m-4 pb-8 flex justify-center gap-2">
          <div style={{ width: 400 }}>
            <label>Description</label>
            <div style={{height: 100}} className={`${isAutoFillPending && 'glowing-border'}`}>
            <textarea
              className={`w-full h-full rounded-2xl p-2 pl-4 border ${emptyInputs.includes('description') ? 'border-red-500' : 'border-slate-400' }`}
              value={productDescription}
              onChange={(e) => {
                setProductDescription(e.target.value);
              }}
            />
            </div>
          </div>
        </div>

        {/*Buttons */}
        <div className="mt-4  flex justify-center gap-8">
          <button
            className="bg-blue-500 rounded-2xl pl-8 pr-8 p-2  text-white"
            onClick={clickAddProduct}
          >
            Add product
          </button>
          <button
            className="bg-black rounded-2xl pl-12 pr-12  p-2 text-white"
            onClick={() => {
              dispatch(updateCurrentPopup("none"));
            }}
          >
            Cancel
          </button>
        </div>
        <div
          className={`${
            !isLoading && "invisible"
          } flex justify-center items-center h-12`}
        >
          <Image alt="" width={30} height={30} src={Loading} />
        </div>
      </div>
    </div>
  );
}
