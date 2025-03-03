
import { useState, useRef } from 'react';
import { resizeImage } from '@/lib/imageProcess';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageSelect: (file: Blob) => void;
}

export const ImageUpload = ({ onImageSelect }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      const resizedImage = await resizeImage(file);
      setPreview(URL.createObjectURL(resizedImage));
      onImageSelect(resizedImage);
    } catch (error) {
      toast.error('Failed to process image');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative h-32 w-32 cursor-pointer overflow-hidden rounded-full bg-gray-100"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            className="h-full w-full object-cover transition-all hover:opacity-90"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
      />
      <p className="text-sm text-gray-500">
        Click to upload profile picture
      </p>
    </div>
  );
};
