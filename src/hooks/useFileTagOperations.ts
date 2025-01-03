import { Folder, FileTag } from '@/types/files';
import { supabase } from '@/integrations/supabase/client';
import { ToastProps } from '@/types/toast';

interface UseFileTagOperationsProps {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  tags: FileTag[];
  setTags: React.Dispatch<React.SetStateAction<FileTag[]>>;
  toast: {
    toast: (props: ToastProps) => void;
  };
}

export const useFileTagOperations = ({ 
  folders, 
  setFolders, 
  tags, 
  setTags, 
  toast 
}: UseFileTagOperationsProps) => {
  const fetchTags = async () => {
    try {
      console.log('Fetching tags...');
      const { data, error } = await supabase
        .from('file_tags')
        .select('*');

      if (error) throw error;

      console.log('Fetched tags:', data);
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.toast({
        title: "Error",
        description: "Failed to fetch tags",
        variant: "destructive",
      });
    }
  };

  const addTag = async (name: string): Promise<FileTag> => {
    try {
      console.log('Adding tag:', name);
      const { data, error } = await supabase
        .from('file_tags')
        .insert({ name })
        .select()
        .single();

      if (error) throw error;

      const newTag: FileTag = {
        id: data.id,
        name: data.name,
      };

      setTags((prevTags: FileTag[]) => [...prevTags, newTag]);
      console.log('Added tag:', newTag);
      return newTag;
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addTagToFile = async (folderId: string, fileId: string, tagId: string) => {
    try {
      console.log('Adding tag to file:', { folderId, fileId, tagId });
      
      const { data: existingRelation, error: checkError } = await supabase
        .from('file_tag_relations')
        .select()
        .eq('file_id', fileId)
        .eq('tag_id', tagId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingRelation) {
        console.log('Tag already exists on file');
        return;
      }

      const { error } = await supabase
        .from('file_tag_relations')
        .insert({ file_id: fileId, tag_id: tagId });

      if (error) throw error;

      const tag = tags.find(t => t.id === tagId);
      if (!tag) throw new Error('Tag not found');

      setFolders(folders.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            files: folder.files.map(file => {
              if (file.id === fileId) {
                return {
                  ...file,
                  tags: [...file.tags, tag],
                };
              }
              return file;
            }),
          };
        }
        return folder;
      }));

      console.log('Successfully added tag to file');
    } catch (error) {
      console.error('Error adding tag to file:', error);
      toast.toast({
        title: "Error",
        description: "Failed to add tag to file",
        variant: "destructive",
      });
      throw error;
    }
  };

  const removeTagFromFile = async (folderId: string, fileId: string, tagId: string) => {
    try {
      console.log('Removing tag from file:', { folderId, fileId, tagId });
      const { error } = await supabase
        .from('file_tag_relations')
        .delete()
        .match({ file_id: fileId, tag_id: tagId });

      if (error) throw error;

      setFolders(folders.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            files: folder.files.map(file => {
              if (file.id === fileId) {
                return {
                  ...file,
                  tags: file.tags.filter(tag => tag.id !== tagId),
                };
              }
              return file;
            }),
          };
        }
        return folder;
      }));

      console.log('Successfully removed tag from file');
    } catch (error) {
      console.error('Error removing tag from file:', error);
      toast.toast({
        title: "Error",
        description: "Failed to remove tag from file",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    fetchTags,
    addTag,
    addTagToFile,
    removeTagFromFile,
  };
};