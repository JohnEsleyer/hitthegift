"use client";

import { createProduct } from "@/app/actions/products/createProduct";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Loading from "/public/loading.svg";
import ProductImageUploader from "@/components/ProductImageUploader";
import { v4 as uuidv4 } from "uuid";
import { insertMyListProduct } from "@/lib/features/mylist";
import { handleBase64ToFormData } from "@/utils/base64ToFormData";
import uploadProductImage from "@/app/actions/s3/uploadProductImage";
import { createObjectId } from "@/app/actions/mongoActions";
import { extractASIN } from "./functions";
import getProductDetails from "@/app/actions/amazon/getProductDetails";
import { updateAmazonImageUrl, updateBase64Image } from "@/lib/features/productImageUpload";
import { getAmazonDomain } from "@/utils/getAmazonDomain";

export default function AddProductPopup() {
  const dispatch = useDispatch();
  const [productTitle, setProductTitle] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [price, setPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [currency, setCurrency] = useState("USD");

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
    // if (productDescription == ''){
    //   setEmptyInputs((prev) => [...prev, 'description']);
    //   emptyInput = 'description'
    //   emptyCounter++;
    // }

    if (emptyCounter >= 1){
      return;
    }
    
    setIsLoading(true);
    try {
      const productId = await createObjectId();
      // Function to create a product
      const createNewProduct = async (imageUrl: string) => {
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
      const ASIN = extractASIN(productUrl);
      startAutoFillTransition(async () => {
        const domain = getAmazonDomain(productUrl);
        if (ASIN && domain){
          console.log('has ASIN');
          try{
            const res = await getProductDetails(ASIN,domain);
            if (res){
              console.log('Product details fetched');
              setProductTitle(res.title);
              setProductDescription(res.description);
              setPrice(res.price);
              setProductImageUrl(res.imageUrl);
              dispatch(updateAmazonImageUrl(res.imageUrl));
            }
            // Reset Image Upload state
            dispatch(updateBase64Image(''));
            console.log('Fetch product details: Success');
          }catch(e){
            console.log(`Failed to fetch product detaisl: ${e}`);
          }
        }else{
          console.log('No ASIN');
          await new Promise(resolve => setTimeout(resolve, 2000)); // 3 sec

        }
      });
    }
  },[autoFill, productUrl]);

  return (
    <div
      style={{fontSize: 14, width: 426, height: 552, marginTop: 50}}
      className="pt-4 pr-1 overflow-auto hide-scrollbar bg-white rounded-2xl border-2 border-gray-300"
    >
      <div className="h-full">
        {/*Image of the Product */}
        <div className={`flex justify-center`}>
          <div className={`${isAutoFillPending && 'glowing-border'}`}>
          <ProductImageUploader
            width={130}
            height={130}
            productId={(() => {
              return uuidv4();
            })()}
            onUpload={() => {
              setProductImageUrl('');
            }}
          />
          </div>
        </div>
        {/*Title input */}
        <div className="mt-4 flex justify-center ">

            <div>
              <p>Title</p>
              <div  style={{width: 250, height: 30}} className={`${isAutoFillPending && 'glowing-border'}`}>
              <input
                style={{ height: 30}}
                className={`rounded-full p-2 pl-4 border ${emptyInputs.includes('title') ? 'border-red-500' : 'border-slate-300' } `}
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
              <div className={`flex rounded-full bg-white border ${emptyInputs.includes('price') ? 'border-red-500' : 'border-slate-300' } ${isAutoFillPending && 'glowing-border'}`}>
                <input
                  style={{ width: 100, height:30}}
                  className="border-slate-400 rounded-full pl-2 "
                  placeholder="1.00"
                  type="string"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
              </div>
            </div>
        </div>
        
        {/*Product URL input */}
        <div className="mt-4 flex justify-center ">
          <div style={{ width: 350 }}>
            <p>Product URL</p>
            <input
              style={{height:30}}
              className={` border border-slate-300 rounded-full w-full p-2 pl-4`}
              placeholder={"Product URL"}
              value={productUrl}
              onChange={(e) => {
                setProductUrl(e.target.value);
              }}
            />
         <p className="text-gray-500 text-xs flex justify-center">If autofill doesn't work, please enter the information manually</p>
          </div>
        </div>
          
        {/** Auto fill product details */}
        <div className="mt-4 flex justify-center">
          <div style={{height: 50}} className="flex justify-between">
            <div style={{fontSize: 14}} className="flex flex-col">
              <p>Auto Fill Product Details</p>
              <p style={{width: 250}} className="text-gray-500 text-xs ">
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
        <div className="mt-4 m-4 flex justify-center gap-2">
          <div style={{ width: 340 }}>
            <label>Description</label>
            <div style={{height: 70}} className={`${isAutoFillPending && 'glowing-border'}`}>
            <textarea
            placeholder="Brief description "
              className={`w-full h-full rounded-2xl p-2 pl-4 border ${emptyInputs.includes('description') ? 'border-red-500' : 'border-slate-300' }`}
              value={productDescription}
              onChange={(e) => {
                setProductDescription(e.target.value);
              }}
            />
            </div>
          </div>
        </div>

        {/*Buttons */}
        <div style={{height: 70}} className=" flex items-start  justify-center gap-8">
          {isLoading ? <div style={{height: 40}} className="flex justify-center items-center">
            <Image alt="" width={30} height={30} src={Loading} />
          </div> : <button
            style={{width:120, height: 30}}
            className="bg-blue-500 rounded-2xl text-white"
            onClick={clickAddProduct}
          >
            Add product
          </button>}
          <button
           style={{width:120, height: 30}}
            className="bg-black rounded-2xl  text-white"
            onClick={() => {
              dispatch(updateCurrentPopup("none"));
            }}
          >
            Cancel
          </button>
        </div>
    
      </div>
    </div>
  );
}
