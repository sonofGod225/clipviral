import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing Supabase URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase anon key');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase service role key');
}

// Client public pour les requêtes côté client
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Client admin pour les requêtes côté serveur
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper pour le stockage des fichiers
export async function uploadFile(
  bucket: 'videos' | 'images' | 'audio',
  path: string,
  file: File | Blob
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;
  return data;
}

// Helper pour la suppression des fichiers
export async function deleteFile(
  bucket: 'videos' | 'images' | 'audio',
  path: string
) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

// Helper pour obtenir l'URL publique d'un fichier
export function getPublicUrl(
  bucket: 'videos' | 'images' | 'audio',
  path: string
) {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
} 