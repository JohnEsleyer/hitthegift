"use client";

import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currencies } from "./constants";
import Image from "next/image";
import Loading from "/public/loading.svg";
import ProductImageUploader from "@/components/ProductImageUploader";
import { v4 as uuidv4 } from "uuid";
import {
  deleteMyListProductById,
  updateProductStore,
} from "@/lib/features/mylist";
import {
  updateEditProductCurrency,
  updateEditProductDescription,
  updateEditProductPrice,
  updateEditProductProductUrl,
  updateEditProductTitle,
} from "@/lib/features/editProductsPopup";
import { updateProduct } from "@/app/actions/products/updateProduct";
import { imageUrlToBase64 } from "@/utils/imageUrlToBase64";
import {
  updateAmazonImageUrl,
  updateBase64Image,
} from "@/lib/features/productImageUpload";
import { handleBase64ToFormData } from "@/utils/base64ToFormData";
import uploadProductImage from "@/app/actions/s3/uploadProductImage";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/products/deleteProduct";
import CountryFlag from "./CountryFlag";
import { extractASIN } from "./functions";
import getProductDetails from "@/app/actions/amazon/getProductDetails";
import '@/styles/GlowingBorder.css';

type ResponseData = {
  message: string;
  status: number;
};

export default function EditProductPopup() {
  const dispatch = useDispatch();
  const title = useSelector((state: RootState) => state.editProductPopup.title);
  const productUrl = useSelector(
    (state: RootState) => state.editProductPopup.productUrl
  );
  const price = useSelector((state: RootState) => state.editProductPopup.price);
  const description = useSelector(
    (state: RootState) => state.editProductPopup.description
  );
  const currency = useSelector(
    (state: RootState) => state.editProductPopup.currency
  );
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

  const productId = useSelector(
    (state: RootState) => state.editProductPopup.id
  );
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [deleteFailed, setDeleteFailed] = useState(false);

  // States about product auto fill
  const [autoFill, setAutoFill] = useState(true);
  const [isAutoFillPending, startAutoFillTransition] = useTransition();
  const productImageUrl = useSelector(
    (state: RootState) => state.productImageUpload.amazonImageUrl
  );
  const [didInitialize, setDidInitialize] = useState(false);

  useEffect(() => {
    // This code makes sure that the imageUrl of the product being edited is the one displayed
    const handleImageConversion = async () => {
      try {
        // 1. Convert productImageUrl to a base64 string
        const base64Image = await imageUrlToBase64(productImageUrl);

        // 2. Dispatch the base64Image so that the image uploader can use it
        dispatch(updateBase64Image(base64Image || ""));
      } catch (error) {
        console.error("Error converting image to base64:", error);
        // Optionally, handle errors by dispatching a default or empty base64 string
        dispatch(updateBase64Image(""));
      }
    };
    setDidInitialize(true);
    handleImageConversion();
  }, []);

  useEffect(() => {
    if (autoFill && didInitialize) {
      const ASIN = extractASIN(productUrl);
      startAutoFillTransition(async () => {
        if (ASIN) {
          console.log('has ASIN');
          try {
            const res = await getProductDetails(ASIN);
            if (res) {
              dispatch(updateEditProductTitle(res.title));
              dispatch(updateEditProductDescription(res.description));
              dispatch(updateEditProductPrice(res.price));
              dispatch(updateAmazonImageUrl(res.imageUrl));
            }

            // Reset Image Upload state
            dispatch(updateBase64Image(""));
          } catch (e) {
            console.log(e);
          }
        }else{
          console.log('No ASIN');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      });
    }
  }, [autoFill, productUrl]);

  const clickSaveProduct = async () => {
    setIsLoading(true);
    try {
      if (productImageUrl == "") {
        // Upload selectedImage to S3
        // 1. Convert base64 file string to FormData
        const formData = handleBase64ToFormData(
          selectedImage,
          "productImage.webp"
        );
        // 2. Upload
        const result = await uploadProductImage(formData, productId);

        if (result.success) {
          const responseData = await updateProduct({
            productId: productId,
            userId: userId,
            title: title,
            currency: currency,
            price: price,
            productUrl: productUrl,
            imageUrl:
              productImageUrl !== "" ? productImageUrl : result.url || "",
            description: description,
          });

          if (responseData.status == 200) {
            setResponse(responseData);

            dispatch(
              updateProductStore({
                id: productId,
                title: title,
                userId: userId,
                price: price,
                currency: currency,
                productUrl: productUrl,
                imageUrl: result.url || "",
                description: description,
              })
            );
          }
        }
      }else {
        const responseData = await updateProduct({
          productId: productId,
          userId: userId,
          title: title,
          currency: currency,
          price: price,
          productUrl: productUrl,
          imageUrl: productImageUrl,
          description: description,
        });

        if (responseData.status == 200) {
          setResponse(responseData);

          dispatch(
            updateProductStore({
              id: productId,
              title: title,
              userId: userId,
              price: price,
              currency: currency,
              productUrl: productUrl,
              imageUrl: productImageUrl,
              description: description,
            })
          );
        }
      }
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => {
      dispatch(updateCurrentPopup("none"));
      setIsLoading(false);
    }, 3000);
  };

  const handleDeleteProduct = () => {
    startDeleteTransition(async () => {
      setDeleteFailed(false);
      try {
        const res = await deleteProduct(productId);
        if (res) {
          dispatch(deleteMyListProductById(productId));
          dispatch(updateCurrentPopup("none"));
        }
      } catch (e) {
        console.log(e);
        setDeleteFailed(true);
      }
    });
  };


  // The following will be displayed if user clicks on the delete icon
  if (showConfirmDelete) {
    return (
      <div
        style={{ height: 230 }}
        className="flex flex-col justify-center border-2 border-slate-400 items-center rounded-2xl p-16 bg-white "
      >
        <p className="mt-4">Are you sure you want to delete this product?</p>
        <div className="flex gap-4 mt-4">
        {isDeletePending ? <div style={{height:25}} className="flex justify-center items-center"><Image
            className={`mt-4`}
            src={Loading}
            alt=""
            width={30}
            height={30}
          /> </div>: 
          <button
            onClick={handleDeleteProduct}
            className="text-white bg-blue-500 rounded-2xl p-2 pl-4 pr-4"
          >
            Yes
          </button>}
          <button
            onClick={() => {
              setShowConfirmDelete(false);
            }}
            className="text-white bg-black rounded-2xl p-2 pl-4 pr-4"
          >
            No
          </button>
        </div>
        <div
          style={{ height: 40 }}
          className="h-4 mt-2 w-full flex flex-col justify-center items-center"
        >
          
          {deleteFailed && (
            <p className={`text-red-600`}>Failed to delete product</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ width: 500, height: 630, marginTop: 50 }}
      className="overflow-auto hide-scrollbar pt-4 pr-1 rounded-2xl border-2 bg-white border-slate-400"
    >
      <div className="h-full  ">
        {/*Delete product */}
        <div className="flex justify-start pl-4 ">
          <button onClick={() => setShowConfirmDelete(true)}>
            <Trash2 className="hover:text-red-500" size={25} />
          </button>
        </div>
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
              <div  style={{width: 270, height: 40}} className={`${isAutoFillPending && 'glowing-border'}`}>
              <input
                className={`rounded-full p-2 pl-4 border border-slate-400 `}
                placeholder={"Product name"}
                value={title}
                onChange={(e) => {
                  //   setTitle(e.target.value);
                  dispatch(updateEditProductTitle(e.target.value));
                }}
              />
              </div>
            </div>
            <div className="flex flex-col">
              <label>Price</label>
              <div className={`border border-slate-400 flex rounded-full bg-white ${isAutoFillPending && 'glowing-border'}`}>
                <input
                  style={{ width: 100 }}
                  className="border-r border-slate-400 rounded-l-full pl-2 p-2 "
                  type="number"
                  value={price}
                  placeholder="1.00"
                  onChange={(e) => {
                    // setPriceInput(e.target.value);
                    dispatch(updateEditProductPrice(e.target.value));
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
                      style={{ zIndex: 100, width: 80, top: 30, right: 1 }}
                      className="flex flex-col border border-slate-400 h-52 p-2 overflow-auto absolute mt-2 bg-white rounded shadow-md"
                    >
                      {currencies.map((currency) => (
                        <button
                          className="flex justify-between hover:bg-gray-200 w-full"
                          onClick={() => {
                            //   setCurrencyInput(currency);
                            dispatch(updateEditProductCurrency(currency));
                            setShowCurrencyOptions(false);
                          }}
                          key={currency}
                        >
                          <CountryFlag currency={currency} />{" "}
                          <span>{currency}</span>
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
              className="rounded-full p-2 pl-4 border border-slate-400"
              placeholder={"Product URL"}
              value={productUrl}
              onChange={(e) => {
                // setProductUrlInput(e.target.value);
                dispatch(updateEditProductProductUrl(e.target.value));
              }}
            />
          </div>
        </div>
        {/** Auto fill produduct details */}
        <div className="mt-4 flex justify-center">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p>Picture and description auto</p>
              <p style={{width: 350}} className="text-gray-500">
                Fill product title, description, and image when product URL is
                given.
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
              className="hide-scrollbar w-full h-full rounded-2xl p-2 pl-4 border border-slate-400"
              value={description}
              onChange={(e) => {
                // setDescriptionInput(e.target.value);
                dispatch(updateEditProductDescription(e.target.value));
              }}
            />
            </div>
          </div>
        </div>

        {/*Buttons */}
        <div style={{height: 70}} className="mt-4  flex items-start justify-center gap-8">
          {isLoading ? <div style={{height: 40}} className="flex justify-center items-center">
            <Image alt="" width={30} height={30} src={Loading} />
            </div> : <button
            className="bg-blue-500 rounded-2xl pl-12 pr-12 p-2 text-white"
            onClick={clickSaveProduct}
          >
            Save
          </button>}
          <button
            className="bg-black rounded-2xl pl-12 pr-12 p-2 text-white"
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
