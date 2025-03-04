'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVisualStyles, useDeleteVisualStyle, useCreateVisualStyle, useUpdateVisualStyle } from '@/features/prompts/hooks/useVisualStyles';
import { VisualStyle } from '@/lib/db/schema/prompts';
import { toast } from 'sonner';
import Image from 'next/image';
import { ImageUpload } from '@/components/ImageUpload';
import { LuGlobe } from 'react-icons/lu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function VisualStylesManager() {
  const { t, i18n } = useTranslation();
  const { data: visualStyles, isLoading } = useVisualStyles();
  const { mutate: deleteStyle } = useDeleteVisualStyle();
  const { mutate: createStyle } = useCreateVisualStyle();
  const { mutate: updateStyle } = useUpdateVisualStyle();
  const [isEditing, setIsEditing] = useState(false);
  const [editingStyle, setEditingStyle] = useState<VisualStyle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [displayLang, setDisplayLang] = useState<'fr' | 'en'>('fr');
  const itemsPerPage = 6;

  const totalPages = visualStyles ? Math.ceil(visualStyles.length / itemsPerPage) : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStyles = visualStyles?.slice(startIndex, endIndex) || [];

  // Type guard for language
  const isValidLang = (lang: string): lang is 'fr' | 'en' => {
    return lang === 'fr' || lang === 'en';
  };

  // Get current language with type safety
  const currentLang = isValidLang(i18n.language) ? i18n.language : 'fr';

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (style: VisualStyle) => {
    setEditingStyle(style);
    setImageUrl(style.imageUrl);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    deleteStyle(id, {
      onSuccess: () => {
        toast.success(t('superadmin.styles.deleteSuccess'));
      },
      onError: () => {
        toast.error(t('superadmin.styles.deleteError'));
      }
    });
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const styleData = {
      translations: {
        fr: {
          name: formData.get('name_fr') as string,
          description: formData.get('description_fr') as string,
        },
        en: {
          name: formData.get('name_en') as string,
          description: formData.get('description_en') as string,
        },
      },
      prompt: formData.get('prompt') as string || '',
      imageUrl,
      order: parseInt(formData.get('order') as string),
    };

    if (editingStyle) {
      updateStyle(
        { id: editingStyle.id, ...styleData },
        {
          onSuccess: () => {
            toast.success(t('superadmin.styles.updateSuccess'));
            setIsEditing(false);
          },
          onError: () => {
            toast.error(t('superadmin.styles.updateError'));
          },
        }
      );
    } else {
      createStyle(styleData, {
        onSuccess: () => {
          toast.success(t('superadmin.styles.createSuccess'));
          setIsEditing(false);
        },
        onError: () => {
          toast.error(t('superadmin.styles.createError'));
        },
      });
    }
  };

  const toggleFormLang = () => {
    setDisplayLang(displayLang === 'fr' ? 'en' : 'fr');
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('superadmin.styles.title')}
        </h1>
        <button
          onClick={() => {
            setEditingStyle(null);
            setIsEditing(true);
          }}
          className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-pink-600"
        >
          {t('superadmin.styles.add')}
        </button>
      </div>

      {isLoading ? (
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentStyles.map((style: VisualStyle) => (
              <div
                key={style.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={style.imageUrl}
                    alt={style.translations[displayLang].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {style.translations[displayLang].name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {style.translations[displayLang].description}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(style)}
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(style.id)}
                      className="flex-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('common.previous')}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    currentPage === page
                      ? 'bg-purple-600 text-white'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('common.next')}
              </button>
            </div>
          )}
        </>
      )}

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingStyle
                ? t('superadmin.styles.edit')
                : t('superadmin.styles.create')}
            </DialogTitle>
          
          </DialogHeader>

          <form onSubmit={handleSave}>
            <div className="mb-4 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* French Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Français</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('superadmin.styles.form.name')}
                    </label>
                    <input
                      type="text"
                      name="name_fr"
                      defaultValue={editingStyle?.translations.fr.name}
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('superadmin.styles.form.description')}
                    </label>
                    <textarea
                      name="description_fr"
                      defaultValue={editingStyle?.translations.fr.description}
                      required
                      rows={2}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    />
                  </div>
                </div>

                {/* English Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">English</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('superadmin.styles.form.name')}
                    </label>
                    <input
                      type="text"
                      name="name_en"
                      defaultValue={editingStyle?.translations.en.name}
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('superadmin.styles.form.description')}
                    </label>
                    <textarea
                      name="description_en"
                      defaultValue={editingStyle?.translations.en.description}
                      required
                      rows={2}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  {t('superadmin.styles.form.promptSection')}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('superadmin.styles.form.prompt')}
                  </label>
                  <textarea
                    name="prompt"
                    defaultValue={editingStyle?.prompt || ''}
                    required
                    rows={2}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 font-mono"
                    placeholder={t('superadmin.styles.form.promptPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('superadmin.styles.form.imageUrl')}
                </label>
                <ImageUpload
                  currentImageUrl={imageUrl}
                  onImageUploaded={setImageUrl}
                  bucket="styles"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('superadmin.styles.form.order')}
                </label>
                <input
                  type="number"
                  name="order"
                  defaultValue={editingStyle?.order ?? 0}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-pink-600"
              >
                {t('common.save')}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 