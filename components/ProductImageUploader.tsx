'use client';

import { updateBase64Image } from '@/lib/features/productImageUpload';
import { RootState } from '@/lib/store';
import {ImageUp } from 'lucide-react';
import { useTransition, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EmptyItem } from './EmptyItem';

interface ProductImageUploaderProps {
  productId: string;
  width: number;
  height: number;
  loadInitialImage?: boolean; // if true, component will try to fetch the image url from redux store and display it
}

export default function ProductImageUploader({
  productId,
  width,
  height,
  loadInitialImage,
}: ProductImageUploaderProps) {
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');

  // imageUrl from the editProductPopup component. Used when loadInitialImage is true
  const reduxImageUrl = useSelector((state: RootState) => state.editProductPopup.imageUrl);

  const dispatch = useDispatch();

  useEffect(() => {
    if (loadInitialImage) {
      console.log('loadInitialImage');
      setImageUrl(reduxImageUrl);
    }
  }, [loadInitialImage, reduxImageUrl]);

  // Handle file selection for the product image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  // Handle the upload of the selected image to the localStorage
  const handleUpload = () => {
    setShowImageOptions(false);
    if (!file || !productId) {
      setUploadStatus('Please select a file');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64Image = reader.result as string;
      try {
        // Store the base64 image in localStorage with the key as productId
        localStorage.setItem(`product_image_${productId}`, base64Image);
        setUploadStatus('File stored successfully in localStorage.');
        setImageUrl(base64Image);
        dispatch(updateBase64Image(base64Image));
      } catch (error) {
        setUploadStatus('Failed to store the file in localStorage.');
      }
    };

    reader.onerror = () => {
      setUploadStatus('Failed to read the file.');
    };

    // Convert the file to a base64 string
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative">
      {imageUrl === '' ? (
        <EmptyItem width={width} height={height}/>
      ) : (
        <img
          className="rounded-md"
          src={imageUrl}
          width={width}
          height={height}
          style={{ objectFit: 'cover' }}
          alt="Product"
        />
      )}

      <div style={{ zIndex: 99, bottom: -10, right: -10 }} className="absolute">
        <button className="bg-white p-2 rounded-2xl" onClick={() => setShowImageOptions((prev) => !prev)}>
          <ImageUp />
        </button>
        {showImageOptions && (
          <div
            style={{ zIndex: 100, width: 220, right: -50 }}
            className="p-2 absolute bg-white shadow-md"
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{ width: 210 }}
              className="text-xs"
            />
            <button
              onClick={handleUpload}
              className="mt-2 w-full border border-black"
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
