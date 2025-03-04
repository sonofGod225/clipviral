import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { uploadProfileImage, deleteProfileImage } from '@/lib/supabase/storage';

interface ProfileImageProps {
  imageUrl?: string | null;
  userId: string;
  onImageChange: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-16 w-16',
  md: 'h-24 w-24',
  lg: 'h-32 w-32',
};

export function ProfileImage({ imageUrl, userId, onImageChange, size = 'md' }: ProfileImageProps) {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation de la taille et du type
    if (file.size > 5 * 1024 * 1024) { // 5MB max
      toast.error(t('errors.fileTooLarge'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error(t('errors.invalidFileType'));
      return;
    }

    setIsUploading(true);
    try {
      // Supprimer l'ancienne image si elle existe
      if (imageUrl) {
        await deleteProfileImage(imageUrl);
      }

      // Upload de la nouvelle image
      const newImageUrl = await uploadProfileImage(file, userId);
      onImageChange(newImageUrl);
      toast.success(t('success.profileImageUpdated'));
    } catch (error) {
      console.error('Error updating profile image:', error);
      toast.error(t('errors.imageUploadFailed'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} group relative cursor-pointer overflow-hidden rounded-full bg-gray-100`}
        onClick={handleImageClick}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={t('profile.profileImage')}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
          {isUploading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
} 