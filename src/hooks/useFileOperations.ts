import { supabase } from "@/integrations/supabase/client";
import { FileType } from "@/types/files";
import { toast } from "@/components/ui/use-toast";

export const useFileOperations = () => {
  const createFolder = async (name: string, type: FileType) => {
    try {
      const { data: folder, error } = await supabase
        .from('folders')
        .insert({
          name,
          type
        })
        .select()
        .single();

      if (error) throw error;
      return folder;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  };

  const uploadFile = async (file: File, folderId: string) => {
    try {
      const { data: fileRecord, error } = await supabase
        .from('files')
        .insert({
          folder_id: folderId,
          name: file.name,
          type: file.type,
          size: file.size,
          path: `${folderId}/${file.name}`
        })
        .select()
        .single();

      if (error) throw error;
      return fileRecord;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  return {
    createFolder,
    uploadFile,
    deleteFile
  };
};
