import React, { useState, useRef } from "react";
import { uploadImage, validateImage, compressImage } from "../utils/imageUpload";

const ImageUpload = ({ onUpload, onCancel, className = "" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!validateImage(file)) {
      return;
    }

    try {
      setIsUploading(true);
      const compressedFile = await compressImage(file);
      const imageUrl = await uploadImage(compressedFile);
      onUpload(imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Image</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
              : "border-gray-300 dark:border-gray-600"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="space-y-4">
              <div className="animate-spin text-4xl">⏳</div>
              <p className="text-gray-600 dark:text-gray-400">Uploading...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-4xl">📁</div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop an image here, or
                </p>
                <button
                  onClick={onButtonClick}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  click to select
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supports: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUpload; 