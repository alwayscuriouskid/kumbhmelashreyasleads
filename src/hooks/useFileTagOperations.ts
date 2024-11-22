import { Folder, FileTag } from '@/types/files';
import { supabase } from '@/integrations/supabase/client';
import { Toast } from '@/components/ui/use-toast';

interface UseFileTagOperationsProps {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  tags: FileTag[];
  setTags: (tags: FileTag[]) => void;
  toast: {
    toast: (props: Toast) => void;
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

  const addTag = async (name: string) => {
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

      setTags([...tags, newTag]);
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
      
      // Check if the tag is already added to the file
      const { data: existingRelation } = await supabase
        .from('file_tag_relations')
        .select('*')
        .eq('file_id', fileId)
        .eq('tag_id', tagId)
        .single();

      if (existingRelation) {
        console.log('Tag already exists on file');
        return;
      }

      const { error } = await supabase
        .from('file_tag_relations')
        .insert({ file_id: fileId, tag_id: tagId });

      if (error) throw error;

      const tag = tags.find(t => t.id === tagId);
      if (!tag) return;

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

      console.log('Added tag to file:', { fileId, tagId });
    } catch (error) {
      console.error('Error adding tag to file:', error);
      toast.toast({
        title: "Error",
        description: "Failed to add tag to file",
        variant: "destructive",
      });
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

      console.log('Removed tag from file:', { fileId, tagId });
    } catch (error) {
      console.error('Error removing tag from file:', error);
      toast.toast({
        title: "Error",
        description: "Failed to remove tag from file",
        variant: "destructive",
      });
    }
  };

  return {
    fetchTags,
    addTag,
    addTagToFile,
    removeTagFromFile,
  };
};