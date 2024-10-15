"use client";

import { createProduct } from "@/app/actions/products/createProduct";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currencies } from "../constants";
import Image from 'next/image';
import Loading from '/public/loading.svg';
import ProductImageUploader from "@/components/ProductImageUploader";
import { v4 as uuidv4 } from 'uuid';
import { insertMyListProduct, updateProductStore } from "@/lib/features/mylist";
import { updateImageUrl } from "@/lib/features/productImageUpload";
import { updateEditProductCurrency, updateEditProductDescription, updateEditProductPrice, updateEditProductProductUrl, updateEditProductTitle } from "@/lib/features/editProductsPopup";
import { updateProduct } from "@/app/actions/products/updateProduct";

type ResponseData = {
  message: string;
  status: number;
};

export default function EditProductPopup() {
  const dispatch = useDispatch();
  const title = useSelector((state: RootState) => state.editProductPopup.title);
  const productUrl = useSelector((state: RootState) => state.editProductPopup.productUrl);
  const price = useSelector((state: RootState) => state.editProductPopup.price);
  const description = useSelector((state: RootState) => state.editProductPopup.description);
  const currency = useSelector((state: RootState) => state.editProductPopup.currency);
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
  const [response, setResponse] = useState<ResponseData>({
    message: "",
    status: 0,
  });
  const [isLoading, setIsLoading] = useState(false);  
  const userId = useSelector((state: RootState) => state.userData.id);
  const imageUrl = useSelector((state: RootState) => state.productImageUpload.imageUrl);
  const productId = useSelector((state: RootState) => state.editProductPopup.id);
  
  const clickAddProduct = async () => {
      setIsLoading(true);
      try {
        console.log('creating product');
        const responseData = await updateProduct({
          productId: productId,
          userId: userId,
          title: title,
          currency: currency,
          price: price,
          productUrl: productUrl,
          imageUrl: imageUrl,
          description: description,
        });
        console.log('product created');
  
        if (responseData.status == 200) {
          console.log(responseData.message);
          setResponse(responseData);

          dispatch(updateProductStore({
            id: productId,
            title: title,
            userId: userId,
            price: price,
            currency: currency,
            productUrl: productUrl,
            imageUrl: imageUrl,
            description: description
          }))
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
            loadInitialImage={true}
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
                value={title}
                onChange={(e) => {
                //   setTitle(e.target.value);
                  dispatch(updateEditProductTitle(e.target.value));
                }}
              />
            </div>
            <div className="flex flex-col">
              <label>Price</label>
              <div className="flex rounded-full bg-white ">
            
              <input 
                style={{width: 100}} 
                className="border rounded-l-full pl-2 "
                value={price}
                placeholder="1.00"
                onChange={(e) => {
                    // setPriceInput(e.target.value);
                    dispatch(updateEditProductPrice(e.target.value));
                }}
                />
                    <div className="relative p-2 flex items-center ">
                        <button className=" " onClick={() => {
                            setShowCurrencyOptions((prev) => !prev);
                        }}>
                            USD
                        </button>
                        {
                        showCurrencyOptions && (
                            <ul style={{zIndex: 100, top: 30,right: 1 }} className="flex flex-col h-52 p-4 overflow-auto absolute mt-2 bg-white rounded shadow-md">
                                {currencies.map((currency) => (
                                    <button onClick={() => {
                                    //   setCurrencyInput(currency);
                                    dispatch(updateEditProductCurrency(currency));
                                      setShowCurrencyOptions(false);
                                    }} key={currency}>
                                        {currency}
                                    </button>
                                ))}
                            </ul>
                        )
                    }
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
              style={{width: 430}}
              className="rounded-full p-2 pl-4"
              placeholder={"Product URL"}
              value={productUrl}
              onChange={(e) => {
                // setProductUrlInput(e.target.value);
                dispatch(updateEditProductProductUrl(e.target.value));
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
              <input type="checkbox" onChange={(e) => {
                e.target.value;
              }} />

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
              value={description}
              onChange={(e) => {
                // setDescriptionInput(e.target.value);
                dispatch(updateEditProductDescription(e.target.value));
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
            Save
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
        <div className={`${!isLoading && 'invisible'} flex justify-center items-center h-12`}>
          <Image 
          alt=""
          width={30}
          height={30}
          src={Loading}

          />
        </div> 
      </div>
    </div>
  );
}
