'use client'

import React, { useState } from 'react';

const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);

  // Handles image upload and stores it in localStorage
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Store the base64 image in localStorage
        localStorage.setItem('uploadedImage', base64);
        setImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handles displaying the image from localStorage
  const handleDisplayImage = () => {
    const storedImage = localStorage.getItem('uploadedImage');
    if (storedImage) {
      setImage(storedImage);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Image Upload</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />
      <button
        onClick={handleDisplayImage}
        className="bg-blue-500 text-white py-1 px-2 rounded mb-4"
      >
        Display Image
      </button>
      {image && (
        <div>
          <img
            src={image}
            alt="Uploaded"
            className="mt-4 max-w-full h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
