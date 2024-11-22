import { Folder, File, FileType } from '@/types/files';
import { supabase } from '@/integrations/supabase/client';
import { ToastProps } from '@/components/ui/toast';

interface UseFileOperationsProps {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  toast: {
    toast: (props: ToastProps) => void;
  };
}

export const useFileOperations = ({ folders, setFolders, toast }: UseFileOperationsProps) => {
  const fetchFolders = async () => {
    try {
      console.log('Fetching folders...');
      const { data: foldersData, error: foldersError } = await supabase
        .from('folders')
        .select('*');

      if (foldersError) throw foldersError;

      const { data: filesData, error: filesError } = await supabase
        .from('files')
        .select(`
          *,
          file_tag_relations(
            tag_id,
            file_tags(*)
          )
        `);

      if (filesError) throw filesError;

      const transformedFolders = foldersData.map(folder => ({
        id: folder.id,
        name: folder.name,
        type: folder.type as FileType,
        files: filesData
          ?.filter(file => file.folder_id === folder.id)
          .map(file => ({
            id: file.id,
            name: file.name,
            type: file.type as FileType,
            folderId: file.folder_id,
            size: file.size,
            tags: file.file_tag_relations
              ?.map(relation => relation.file_tags)
              .filter(Boolean) || [],
            createdAt: new Date(file.created_at),
          })) || [],
      }));

      console.log('Fetched folders:', transformedFolders);
      setFolders(transformedFolders);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.toast({
        title: "Error",
        description: "Failed to fetch folders and files",
        variant: "destructive",
      });
    }
  };

  const addFolder = async (name: string, type: FileType) => {
    try {
      console.log('Adding folder:', { name, type });
      const { data, error } = await supabase
        .from('folders')
        .insert({ name, type })
        .select()
        .single();

      if (error) throw error;

      const newFolder: Folder = {
        id: data.id,
        name: data.name,
        type: data.type as FileType,
        files: [],
      };

      setFolders([...folders, newFolder]);
      console.log('Added folder:', newFolder);
    } catch (error) {
      console.error('Error adding folder:', error);
      toast.toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      console.log('Deleting folder:', id);
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFolders(folders.filter(folder => folder.id !== id));
      console.log('Deleted folder:', id);
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive",
      });
    }
  };

  const addFile = async (folderId: string, file: Omit<File, 'id' | 'createdAt' | 'tags'>) => {
    try {
      console.log('Adding file:', { folderId, file });
      const { data, error } = await supabase
        .from('files')
        .insert({
          folder_id: folderId,
          name: file.name,
          type: file.type,
          size: file.size,
          path: `${folderId}/${file.name}`,
        })
        .select()
        .single();

      if (error) throw error;

      const newFile: File = {
        id: data.id,
        name: data.name,
        type: data.type as FileType,
        folderId: data.folder_id,
        size: data.size,
        tags: [],
        createdAt: new Date(data.created_at),
      };

      setFolders(folders.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            files: [...folder.files, newFile],
          };
        }
        return folder;
      }));

      console.log('Added file:', newFile);
    } catch (error) {
      console.error('Error adding file:', error);
      toast.toast({
        title: "Error",
        description: "Failed to add file",
        variant: "destructive",
      });
    }
  };

  const deleteFile = async (folderId: string, fileId: string) => {
    try {
      console.log('Deleting file:', { folderId, fileId });
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      setFolders(folders.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            files: folder.files.filter(file => file.id !== fileId),
          };
        }
        return folder;
      }));

      console.log('Deleted file:', fileId);
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  return {
    fetchFolders,
    addFolder,
    deleteFolder,
    addFile,
    deleteFile,
  };
};