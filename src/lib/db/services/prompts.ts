import { supabase } from "@/lib/supabase/client";
import { type QuickPrompt, type PromptParameter, type VisualStyle } from "../schema/prompts";
import { type SupabaseQuickPrompt, type SupabasePromptParameter, type SupabaseVisualStyle } from "@/lib/supabase/types";

export const getQuickPrompts = async (): Promise<QuickPrompt[]> => {
  const { data, error } = await supabase
    .from('quick_prompts')
    .select('*')
    .order('created_at', { ascending: true }) as { data: SupabaseQuickPrompt[] | null, error: any };

  if (error) throw error;
  if (!data) return [];

  return data.map((item) => ({
    ...item,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at)
  }));
};

export const getPromptParameters = async (): Promise<PromptParameter[]> => {
  const { data, error } = await supabase
    .from('prompt_parameters')
    .select('*')
    .order('order', { ascending: true }) as { data: SupabasePromptParameter[] | null, error: any };

  if (error) throw error;
  if (!data) return [];

  return data.map((item) => ({
    ...item,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
    defaultValue: item.default_value
  }));
};

export const getVisualStyles = async (): Promise<VisualStyle[]> => {
  const { data, error } = await supabase
    .from('visual_styles')
    .select('*')
    .order('order', { ascending: true }) as { data: SupabaseVisualStyle[] | null, error: any };

  if (error) throw error;
  if (!data) return [];

  return data.map((item) => ({
    ...item,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
    imageUrl: item.image_url
  }));
}; 