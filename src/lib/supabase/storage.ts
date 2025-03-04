import { supabase } from "./client";
import { v4 as uuidv4 } from "uuid";

export const uploadProfileImage = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    const { error: uploadError, data } = await supabase.storage
      .from('profiles')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

export const deleteProfileImage = async (url: string) => {
  try {
    const path = url.split('/').slice(-2).join('/'); // Get userId/filename
    const { error } = await supabase.storage
      .from('profiles')
      .remove([path]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting profile image:', error);
    throw error;
  }
}; 