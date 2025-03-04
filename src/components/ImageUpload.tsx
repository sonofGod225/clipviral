'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  bucket: string;
  className?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  bucket,
  className = '',
  maxSizeMB = 5
}: ImageUploadProps) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const supabase = createClientComponentClient();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Check file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeMB) {
        toast.error(t('errors.fileTooLarge'));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(t('errors.invalidFileType'));
        return;
      }

      setUploading(true);

      // Upload file to Supabase
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onImageUploaded(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(t('errors.imageUploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
        id="imageUpload"
      />
      <label
        htmlFor="imageUpload"
        className="group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 transition-all hover:border-purple-500"
      >
        {currentImageUrl ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={currentImageUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-2 h-10 w-10 text-gray-400">
              <svg
                className="h-full w-full"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              {uploading
                ? t('superadmin.styles.form.uploading')
                : t('superadmin.styles.form.uploadImage')}
            </p>
          </div>
        )}
      </label>
    </div>
  );
} 