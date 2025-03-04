export type SupabaseQuickPrompt = {
  id: string;
  translations: {
    fr: { title: string; prompt: string };
    en: { title: string; prompt: string };
  };
  category: string;
  created_at: string;
  updated_at: string;
};

export type SupabasePromptParameter = {
  id: string;
  type: string;
  translations: {
    fr: { name: string; description: string };
    en: { name: string; description: string };
  };
  options: {
    fr: Array<{ value: string; label: string }>;
    en: Array<{ value: string; label: string }>;
  };
  default_value: string;
  order: number;
  created_at: string;
  updated_at: string;
};

export type SupabaseVisualStyle = {
  id: string;
  translations: {
    fr: { name: string; description: string };
    en: { name: string; description: string };
  };
  prompt: string;
  image_url: string;
  order: number;
  created_at: string;
  updated_at: string;
}; 