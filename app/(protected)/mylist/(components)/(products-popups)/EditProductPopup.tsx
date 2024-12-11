"use client";

import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { extractASIN } from "./functions";
import getProductDetails from "@/app/actions/amazon/getProductDetails";
import "@/styles/GlowingBorder.css";
import { getAmazonDomain } from "@/utils/getAmazonDomain";
import { currencies } from "./constants";
import CountryFlag from "./CountryFlag";
import { getCurrency } from "@/utils/getCurrencySymbol";
import { convertPriceToNumber } from "@/utils/convertPriceToNumber";

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

  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);

  useEffect(() => {
    // Convert productImageUrl to base64
    const handleImageConversion = async () => {
      if (productImageUrl) {
        try {
          const base64Image = await imageUrlToBase64(productImageUrl);
          dispatch(updateBase64Image(base64Image || ""));
        } catch (error) {
          console.error("Error converting image to base64:", error);
          dispatch(updateBase64Image(""));
        }
      } else {
        // If no productImageUrl, clear the base64Image
        dispatch(updateBase64Image(""));
      }
    };
    setDidInitialize(true);
    handleImageConversion();
  }, [productImageUrl, dispatch]);

  useEffect(() => {
    if (autoFill && didInitialize) {
      const ASIN = extractASIN(productUrl);
      startAutoFillTransition(async () => {
        const domain = getAmazonDomain(productUrl);
        if (ASIN && domain) {
          try {
            const res = await getProductDetails(ASIN, domain);
            if (res) {
              dispatch(updateEditProductTitle(res.title));
              dispatch(updateEditProductDescription(res.description));
              dispatch(updateEditProductPrice(res.price));
              dispatch(
                updateEditProductCurrency(getCurrency(domain) || "USD")
              );
              dispatch(updateAmazonImageUrl(res.imageUrl));
              // Reset Image Upload state
              dispatch(updateBase64Image(""));
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          // No ASIN found, could wait or handle differently
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      });
    }
  }, [productUrl]);

  const clickSaveProduct = async () => {
    setIsLoading(true);

    try {
      let finalImageUrl = productImageUrl; // Start with amazon image url if available

      // If productImageUrl is empty, check if selectedImage is available
      if (!finalImageUrl && selectedImage && selectedImage.trim() !== "") {
        // Attempt image upload
        const formData = handleBase64ToFormData(
          selectedImage,
          "productImage.webp"
        );
        const result = await uploadProductImage(formData, productId);
        if (result.success) {
          finalImageUrl = result.url || "";
        } else {
          console.log("Failed to upload image");
          // If image fails to upload and is required, handle accordingly.
          // For now, just leave image as blank if upload fails.
        }
      }

      // Now update the product with whatever finalImageUrl we have (which may be empty if none provided)
      const responseData = await updateProduct({
        productId: productId,
        userId: userId,
        title: title,
        currency: currency,
        price: price,
        productUrl: productUrl,
        imageUrl: finalImageUrl || "",
        description: description,
      });

      if (responseData.status === 200) {
        setResponse(responseData);
        dispatch(
          updateProductStore({
            id: productId,
            title: title,
            userId: userId,
            price: price,
            currency: currency,
            productUrl: productUrl,
            imageUrl: finalImageUrl || "",
            description: description,
          })
        );
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

  if (showConfirmDelete) {
    return (
      <div
        style={{ height: 230, width: 426, marginTop: 50 }}
        className="flex flex-col justify-center border-2 border-slate-400 items-center rounded-2xl p-16 bg-white"
      >
        <p className="mt-4">Are you sure you want to delete this product?</p>
        <div className="flex gap-4 mt-4">
          {isDeletePending ? (
            <div
              style={{ height: 25 }}
              className="flex justify-center items-center"
            >
              <Image className={`mt-4`} src={Loading} alt="" width={30} height={30} />
            </div>
          ) : (
            <button
              onClick={handleDeleteProduct}
              className="text-white bg-blue-500 rounded-2xl p-2 pl-4 pr-4"
            >
              Yes
            </button>
          )}
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
          {deleteFailed && <p className={`text-red-600`}>Failed to delete product</p>}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ fontSize: 14, width: 426, height: 552, marginTop: 50 }}
      className="pt-4 pr-1 overflow-auto hide-scrollbar bg-white rounded-2xl border-2 border-gray-300"
    >
      <div className="h-full">
        {/* Delete product */}
        <div className="absolute flex justify-start pl-4 ">
          <button onClick={() => setShowConfirmDelete(true)}>
            <Trash2 className="hover:text-red-500" size={25} />
          </button>
        </div>
        {/* Image Uploader */}
        <div className="flex justify-center">
          <div className={`${isAutoFillPending && "glowing-border"}`}>
            <ProductImageUploader
              width={130}
              height={130}
              productId={uuidv4()}
              loadInitialImage={true}
            />
          </div>
        </div>
        {/* Title and Price */}
        <div className="mt-4 flex justify-center ">
          <div>
            <p>Title</p>
            <div style={{ width: 240, height: 30 }} className={`${isAutoFillPending && "glowing-border"}`}>
              <input
                style={{ height: 30, width: 230 }}
                className={`rounded-full p-2 pl-4 border border-slate-300 `}
                placeholder={"Product name"}
                value={title}
                onChange={(e) => {
                  dispatch(updateEditProductTitle(e.target.value));
                }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label>Price</label>
            <div className={`flex rounded-full bg-white border border-slate-300 ${isAutoFillPending && "glowing-border"}`}>
              <input
                style={{ width: 60, height: 30 }}
                className="border-slate-400 border-r rounded-l-full pl-2"
                type="number"
                placeholder="1.00"
                value={convertPriceToNumber(price)}
                onChange={(e) => {
                  dispatch(updateEditProductPrice(e.target.value));
                }}
              />
              <div className="relative flex items-center pl-2 pr-2">
                <button
                  onClick={() => {
                    setShowCurrencyOptions((prev) => !prev);
                  }}
                >
                  {currency}
                </button>
                {showCurrencyOptions && (
                  <ul
                    style={{ zIndex: 100, width: 80, top: 30, right: 1 }}
                    className="flex flex-col h-52 p-2 overflow-auto absolute mt-2 bg-white rounded shadow-md"
                  >
                    {currencies.map((cur) => (
                      <button
                        className="flex justify-between hover:bg-gray-200 w-full"
                        onClick={() => {
                          dispatch(updateEditProductCurrency(cur));
                          setShowCurrencyOptions(false);
                        }}
                        key={cur}
                      >
                        <CountryFlag currency={cur} /> <span>{cur}</span>
                      </button>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Product URL */}
        <div className="mt-4 flex justify-center ">
          <div style={{ width: 350 }}>
            <p>Product URL</p>
            <input
              style={{ height: 30 }}
              className="border border-slate-300 rounded-full w-full p-2 pl-4"
              placeholder={"Product URL"}
              value={productUrl}
              onChange={(e) => {
                dispatch(updateEditProductProductUrl(e.target.value));
              }}
            />
            <p className="text-gray-500 text-xs flex justify-center">
              If autofill doesn't work, please enter the information manually
            </p>
          </div>
        </div>

        {/* Auto fill toggle */}
        <div className="mt-4 flex justify-center">
          <div style={{ height: 50 }} className="flex justify-between items-center">
            <div style={{ fontSize: 14 }} className="flex flex-col">
              <p>Auto Fill Product Details</p>
              <p style={{ width: 250 }} className="text-gray-500 text-xs">
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

        {/* Description */}
        <div className="mt-4 m-4 flex justify-center gap-2">
          <div style={{ width: 340 }}>
            <label>Description</label>
            <div style={{ height: 70 }} className={`${isAutoFillPending && "glowing-border"}`}>
              <textarea
                placeholder="Brief description"
                className="w-full h-full rounded-2xl p-2 pl-4 border border-slate-300"
                value={description}
                onChange={(e) => {
                  dispatch(updateEditProductDescription(e.target.value));
                }}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ height: 70 }} className="flex items-start justify-center gap-8">
          {isLoading ? (
            <div style={{ height: 40 }} className="flex justify-center items-center">
              <Image alt="" width={30} height={30} src={Loading} />
            </div>
          ) : (
            <button
              style={{ width: 120, height: 30 }}
              className="bg-blue-500 rounded-2xl text-white"
              onClick={clickSaveProduct}
            >
              Save
            </button>
          )}
          <button
            style={{ width: 120, height: 30 }}
            className="bg-black rounded-2xl text-white"
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
