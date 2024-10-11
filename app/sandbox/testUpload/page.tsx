'use client'

import uploadProfile from "@/app/actions/s3/uploadProfile";
import { RootState } from "@/lib/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import Image from 'next/image';

export default function testUpload(){
   const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const userId = useSelector((state: RootState) => state.userData.id);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    
    if (!file || !userId) {
      setUploadStatus('Please select a file and provide a user ID.');
      return;
    }

    // Extract file extension and rename file to "profile.<extension>"
    const fileExtension = file.name.split('.').pop(); // Get the extension from the file name
    const renamedFile = new File([file], `${userId}.${fileExtension}`, {
      type: file.type,
    });

    const formData = new FormData();
    formData.append('file', renamedFile); // Append the renamed file

    try {
      setUploadStatus('Uploading...');
      const result = await uploadProfile(formData, userId);

      if (result.success) {
        setUploadStatus(`File uploaded successfully: ${result.url}`);
        setImageUrl(`${result.url}`);
      } else {
        setUploadStatus(`Error: ${result.error}`);
      }
    } catch (error: any) {
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Upload a File</h2>

      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*" // Limit to images for demo, adjust as needed
      />

      <button onClick={handleUpload}>Upload</button>

      {uploadStatus && <p>{uploadStatus}</p>}
      {imageUrl && <img src={imageUrl} width={50} height={50} alt={"profile"}/>}
    </div>
  );
}