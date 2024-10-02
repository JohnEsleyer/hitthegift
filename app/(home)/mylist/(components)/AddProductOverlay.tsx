"use client";
import { createProduct } from "@/app/actions/products/createProduct";
import { Calendar } from "@/components/ui/calendar";
import { updateCurrentOverlay } from "@/lib/features/overlays";
import { RootState } from "@/lib/store";
import { Dispatch, SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currencies } from "../constants";

type ResponseData = {
  message: string;
  status: number;
};


export default function AddProductOverlay() {
  const dispatch = useDispatch();
  const [productName, setProductName] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [autoFill, setAutoFill] = useState("");
  const [price, setPrice] = useState('');
  const [productDescription, setProductDescription] = useState("");
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
  const [response, setResponse] = useState<ResponseData>({
    message: "",
    status: 0,
  });
  const userId = useSelector((state: RootState) => state.userData.id);

  const clickAddProduct = async () => {
    try {
      const data = await createProduct({
        userId: userId,
        title: productName,
        price: price,
        productUrl: productUrl,
        imageUrl: "",
        description: productDescription,
      });

      if (data) {
        console.log(data.message);
        setResponse(data);
      }
    } catch (e) {
      console.log(e);
    }

    dispatch(updateCurrentOverlay("none"));
  };

  return (
    <div
      style={{ width: 500, height: 580 }}
      className="pt-2 pr-1 bg-gray-100 rounded-2xl border-2 border-black"
    >
      <div className="h-full overflow-auto ">
        {/*Image of the Product */}
        <div className="flex justify-center ">
          <div className=" w-32 h-32 bg-gray-300"></div>
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
                style={{width: 100}} 
                className="border rounded-l-full pl-2 "
                placeholder="1.00"
                onChange={(e) => {
                    setPrice(e.target.value);
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
                                    <button>
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
              <input type="checkbox" onChange={(e) => {}} />

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
              dispatch(updateCurrentOverlay("none"));
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
