'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuickPrompts, useCreateQuickPrompt, useUpdateQuickPrompt, useDeleteQuickPrompt } from '@/features/prompts/hooks/usePrompts';
import { QuickPrompt } from '@/lib/db/schema/prompts';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type PromptFormData = {
  category: string;
  translations: {
    en: { title: string; prompt: string };
    fr: { title: string; prompt: string };
  };
};

export default function QuickPromptsManager() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'fr' | 'en';
  const { data: quickPrompts, isLoading } = useQuickPrompts();
  const [open, setOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<QuickPrompt | null>(null);
  
  const [formData, setFormData] = useState<PromptFormData>({
    category: '',
    translations: {
      en: { title: '', prompt: '' },
      fr: { title: '', prompt: '' },
    },
  });

  const createPromptMutation = useCreateQuickPrompt();
  const updatePromptMutation = useUpdateQuickPrompt();
  const deletePromptMutation = useDeleteQuickPrompt();

  const resetForm = () => {
    setFormData({
      category: '',
      translations: {
        en: { title: '', prompt: '' },
        fr: { title: '', prompt: '' },
      },
    });
    setEditingPrompt(null);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const handleEdit = (prompt: QuickPrompt) => {
    setEditingPrompt(prompt);
    setFormData({
      category: prompt.category,
      translations: prompt.translations,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePromptMutation.mutateAsync(id);
      toast.success(t('superadmin.prompts.deleteSuccess'));
    } catch (error) {
      toast.error(t('superadmin.prompts.deleteError'));
    }
  };

  const handleFormChange = (field: string, value: string, lang?: 'en' | 'fr', subfield?: string) => {
    if (lang && subfield) {
      setFormData(prev => ({
        ...prev,
        translations: {
          ...prev.translations,
          [lang]: {
            ...prev.translations[lang],
            [subfield]: value,
          },
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPrompt) {
        await updatePromptMutation.mutateAsync({
          id: editingPrompt.id,
          ...formData,
        });
        toast.success(t('superadmin.prompts.updateSuccess'));
      } else {
        await createPromptMutation.mutateAsync(formData);
        toast.success(t('superadmin.prompts.createSuccess'));
      }
      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        editingPrompt
          ? t('superadmin.prompts.updateError')
          : t('superadmin.prompts.createError')
      );
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('superadmin.prompts.title')}
        </h1>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
              {t('superadmin.prompts.add')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingPrompt
                  ? t('superadmin.prompts.edit')
                  : t('superadmin.prompts.create')}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">{t('superadmin.prompts.category')}</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  placeholder={t('superadmin.prompts.categoryPlaceholder')}
                  required
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-4 text-lg font-medium">English</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="en-title">{t('superadmin.prompts.title')}</Label>
                    <Input
                      id="en-title"
                      value={formData.translations.en.title}
                      onChange={(e) => handleFormChange('translations', e.target.value, 'en', 'title')}
                      placeholder={t('superadmin.prompts.titlePlaceholder')}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="en-prompt">{t('superadmin.prompts.prompt')}</Label>
                    <Textarea
                      id="en-prompt"
                      value={formData.translations.en.prompt}
                      onChange={(e) => handleFormChange('translations', e.target.value, 'en', 'prompt')}
                      placeholder={t('superadmin.prompts.promptPlaceholder')}
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-4 text-lg font-medium">Français</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fr-title">{t('superadmin.prompts.title')}</Label>
                    <Input
                      id="fr-title"
                      value={formData.translations.fr.title}
                      onChange={(e) => handleFormChange('translations', e.target.value, 'fr', 'title')}
                      placeholder={t('superadmin.prompts.titlePlaceholder')}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fr-prompt">{t('superadmin.prompts.prompt')}</Label>
                    <Textarea
                      id="fr-prompt"
                      value={formData.translations.fr.prompt}
                      onChange={(e) => handleFormChange('translations', e.target.value, 'fr', 'prompt')}
                      placeholder={t('superadmin.prompts.promptPlaceholder')}
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                >
                  {t('common.cancel')}
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  disabled={createPromptMutation.isPending || updatePromptMutation.isPending}
                >
                  {(createPromptMutation.isPending || updatePromptMutation.isPending) ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      {t('common.loading')}
                    </span>
                  ) : (
                    t('common.save')
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {quickPrompts && quickPrompts.length > 0 ? (
            quickPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {prompt.translations[currentLang].title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {prompt.translations[currentLang].prompt}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {t('superadmin.prompts.category')}: <span className="inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">{prompt.category}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(prompt)}
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(prompt.id)}
                      disabled={deletePromptMutation.isPending}
                    >
                      {deletePromptMutation.isPending ? (
                        <span className="flex items-center gap-1">
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                        </span>
                      ) : (
                        t('common.delete')
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-500">{t('superadmin.prompts.noPrompts')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 