"use client";

import { createProduct } from "@/app/actions/products/createProduct";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currencies } from "../constants";
import Image from "next/image";
import Loading from "/public/loading.svg";
import ProductImageUploader from "@/components/ProductImageUploader";
import { v4 as uuidv4 } from "uuid";
import { insertMyListProduct } from "@/lib/features/mylist";
import { handleBase64ToFormData } from "@/utils/base64ToFormData";
import uploadProductImage from "@/app/actions/s3/uploadProductImage";

type ResponseData = {
  message: string;
  status: number;
};

export default function AddProductPopup() {
  const dispatch = useDispatch();
  const [productName, setProductName] = useState("");
  const [productUrl, setProductUrl] = useState("");
  // const [autoFill, setAutoFill] = useState("");
  const [price, setPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [currency, setCurrency] = useState("");
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
  const [response, setResponse] = useState<ResponseData>({
    message: "",
    status: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.userData.id);
  const selectedImage = useSelector(
    (state: RootState) => state.productImageUpload.base64Image
  );

  const clickAddProduct = async () => {
    setIsLoading(true);
    try {
      // Upload selectedImage to S3
      // 1. Convert base64 file string to FormData
      const formData = handleBase64ToFormData(
        selectedImage,
        "productImage.webp"
      );
      // 2. Upload
      const result = await uploadProductImage(formData);
      
      if (result.success){
        console.log("creating product");
        const responseData = await createProduct({
          userId: userId,
          title: productName,
          currency: currency,
          price: price,
          productUrl: productUrl,
          imageUrl: result.url || '',
          description: productDescription,
        });
        console.log("product created");
  
        if (responseData.data) {
          console.log(responseData.message);
          setResponse(responseData);
  
          dispatch(insertMyListProduct(responseData.data));
        }
      }else{
        console.error('Failed to upload product image');
      }
     
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => {
      dispatch(updateCurrentPopup("none"));
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div
      style={{ width: 500, height: 630, marginTop: 50 }}
      className="pt-4 pr-1 bg-gray-100 rounded-2xl border-2 border-gray"
    >
      <div className="h-full overflow-auto ">
        {/*Image of the Product */}
        <div className="flex justify-center ">
          <ProductImageUploader
            width={150}
            height={150}
            productId={(() => {
              return uuidv4();
            })()}
          />
        </div>

        {/*Title input */}
        <div className="mt-4 flex justify-center ">
          <div className="flex gap-2">
            <div>
              <p>Title</p>
              <input
                className="rounded-full p-2 pl-4"
                placeholder={"Product name"}
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col">
              <label>Price</label>
              <div className="flex rounded-full bg-white ">
                <input
                  style={{ width: 100 }}
                  className="border rounded-l-full pl-2 "
                  placeholder="1.00"
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
                    USD
                  </button>
                  {showCurrencyOptions && (
                    <ul
                      style={{ zIndex: 100, top: 30, right: 1 }}
                      className="flex flex-col h-52 p-4 overflow-auto absolute mt-2 bg-white rounded shadow-md"
                    >
                      {currencies.map((currency) => (
                        <button
                          onClick={() => {
                            setCurrency(currency);
                            setShowCurrencyOptions(false);
                          }}
                          key={currency}
                        >
                          {currency}
                        </button>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Link input */}
        <div className="mt-4 flex justify-center ">
          <div>
            <p>Product URL</p>
            <input
              style={{ width: 430 }}
              className="rounded-full p-2 pl-4"
              placeholder={"Product URL"}
              value={productUrl}
              onChange={(e) => {
                setProductUrl(e.target.value);
              }}
            />
          </div>
        </div>

        {/** Auto picture and description */}
        <div className="mt-4 flex justify-center">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p>Picture and description auto</p>
              <p className="text-gray-500">
                Fill description and image automatically
              </p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                onChange={(e) => {
                  e.target.value;
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
            <textarea
              className="w-full h-full rounded-2xl p-2 pl-4"
              value={productDescription}
              onChange={(e) => {
                setProductDescription(e.target.value);
              }}
            />
          </div>
        </div>

        {/*Buttons */}
        <div className="mt-4  flex justify-center gap-8">
          <button
            className="bg-blue-500 rounded-2xl pl-12 pr-12  text-white"
            onClick={clickAddProduct}
          >
            Add product
          </button>
          <button
            className="bg-black rounded-2xl pl-12 pr-12  text-white"
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
