'use client';


import uploadProductImage from '@/app/actions/s3/uploadProductImage';
import { updateImageUrl } from '@/lib/features/productImageUpload';
import { RootState } from '@/lib/store';
import { Gift, ImageUp } from 'lucide-react';
import { useTransition, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
    if (loadInitialImage){
      console.log('loadInitialImage');
      setImageUrl(reduxImageUrl);
    }
  }, []);


  // Handle file selection for the product image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  // Handle the upload of the selected image to the server
  const handleUpload = async () => {
    setShowImageOptions(false);
    if (!file || !productId) {
      setUploadStatus('Please select a file and provide a product ID.');
      return;
    }

    // Rename file to include productId and preserve the extension
    const fileExtension = file.name.split('.').pop();
    const renamedFile = new File([file], `${productId}.${fileExtension}`, {
      type: file.type,
    });

    const formData = new FormData();
    formData.append('file', renamedFile); // Append the renamed file

    try {
      setUploadStatus('Uploading...');
      const result = await uploadProductImage(formData);

      if (result.success) {
        setUploadStatus(`File uploaded successfully: ${result.url}`);
        setImageUrl(result.url || '');
        dispatch(updateImageUrl(result.url || ''));
      } else {
        setUploadStatus(`Error: ${result.error}`);
      }
    } catch (error: any) {
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="relative">
      {imageUrl == '' ? (
         <div
         style={{
           width: width,
           height: height,
           backgroundColor: '#e0e0e0',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
         }}
       >
         <Gift color='#7d7d7d'/>
       </div>
     ) : (
       <img
         className="rounded-md"
         src={imageUrl}
         width={width}
         height={height}
         style={{ objectFit: 'cover' }}
         alt="Product"
       />
      )
      }

        <div style={{ zIndex: 99, bottom: -10, right: -10 }} className="absolute">
          <button className="bg-white p-2 rounded-2xl" onClick={() => setShowImageOptions((prev) => !prev)}>
            <ImageUp/>
          </button>
          {showImageOptions && (
            <div
              style={{ zIndex: 100, width: 220, right:-50 }}
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
