import { supabase } from '@/lib/supabase';
import { VideoProject, Scene } from '@/types';

export async function createProject(
  userId: string,
  data: Omit<VideoProject, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'scenes'>
): Promise<VideoProject> {
  const { data: project, error } = await supabase
    .from('projects')
    .insert([
      {
        ...data,
        user_id: userId,
        status: 'draft',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return project;
}

export async function getProjects(userId: string): Promise<VideoProject[]> {
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      scenes (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return projects;
}

export async function getProject(id: string): Promise<VideoProject> {
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      scenes (*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return project;
}

export async function updateProject(
  id: string,
  data: Partial<VideoProject>
): Promise<VideoProject> {
  const { data: project, error } = await supabase
    .from('projects')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function createScene(
  projectId: string,
  data: Omit<Scene, 'id' | 'projectId'>
): Promise<Scene> {
  const { data: scene, error } = await supabase
    .from('scenes')
    .insert([
      {
        ...data,
        project_id: projectId,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return scene;
}

export async function updateScene(
  id: string,
  data: Partial<Scene>
): Promise<Scene> {
  const { data: scene, error } = await supabase
    .from('scenes')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return scene;
}

export async function deleteScene(id: string): Promise<void> {
  const { error } = await supabase
    .from('scenes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
} 