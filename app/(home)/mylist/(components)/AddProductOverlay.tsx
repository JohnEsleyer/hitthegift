'use client'
import { createProduct } from "@/app/actions/products/createProduct";
import { Calendar } from "@/components/ui/calendar";
import { updateCurrentOverlay } from "@/lib/features/overlays";
import { RootState } from "@/lib/store";
import { Dispatch, SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


type ResponseData = {
    message: string;
    status: number;
}


export default function AddProductOverlay(){
    const dispatch = useDispatch();
    const [productName, setProductName] = useState('');
    const [productUrl, setProductUrl] = useState('');
    const [autoFill, setAutoFill] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [response, setResponse] = useState<ResponseData>({
        message: '',
        status: 0,
    });
    const userId = useSelector((state: RootState) => state.userData.id);
    

    const clickAddProduct = async () => {
        try{
            const data = await createProduct({
                userId: userId,
                title: productName,
                productUrl: productUrl,
                imageUrl: '',
                description: productDescription,
            });

            if (data){
                console.log(data.message);
                setResponse(data);
            }
            
        }catch(e){
            console.log(e);
        }

        dispatch(updateCurrentOverlay('none'));
    }


    return (
        <div style={{width: 500, height: 630}} className=" p-4 bg-gray-100 rounded-2xl border-2 border-black">

         {/*Image of the Product */}
         <div className="flex justify-center ">
         <div className=" w-32 h-44 bg-gray-300">
            </div>
        </div>
        
        {/*Title input */}
        <div className="mt-4 flex justify-center "> 
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
        </div>
        {/*Link input */} 
        <div className="mt-4 flex justify-center ">
        <div>
            <p>Product URL</p>
            <input
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
            <p className="text-gray-500">Fill description and image automatically</p>
            </div>
            <label className="switch">
              <input type="checkbox" onChange={(e) => {
               
              }}/>
              
              <span className="slider round"></span>
              </label>
        </div>
        </div>

        {/* Description  */}
        <div className="mt-4 pb-8 flex justify-center">
        <div style={{width: 250}}>
            <p>Description</p>
            <textarea
                className="w-full h-full"
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
            >Add product</button>
          <button 
            className="bg-black rounded-2xl pl-12 pr-12  text-white"
            onClick={() => {
                dispatch(updateCurrentOverlay('none'));
            }}
            >
            Cancel
          </button>
        </div>

     </div>
    )
}