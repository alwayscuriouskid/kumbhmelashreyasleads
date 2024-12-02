import { useState, useEffect } from 'react';
import { File, FileTag, Folder, FileType } from '@/types/files';
import { useToast } from '@/components/ui/use-toast';
import { useFileOperations } from './useFileOperations';
import { useFileTagOperations } from './useFileTagOperations';
import { supabase } from '@/integrations/supabase/client';

export const useFiles = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<FileTag[]>([]);
  const { toast } = useToast();
  
  const { createFolder, uploadFile, deleteFile } = useFileOperations();

  const { 
    fetchTags, 
    addTag, 
    addTagToFile, 
    removeTagFromFile 
  } = useFileTagOperations({ 
    folders, 
    setFolders, 
    tags, 
    setTags, 
    toast: { toast }
  });

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
          file_tag_relations!inner(
            file_tags(*)
          )
        `);

      if (filesError) throw filesError;

      // Process the data to create the folder structure with correct types
      const processedFolders: Folder[] = foldersData.map(folder => ({
        id: folder.id,
        name: folder.name,
        type: folder.type as FileType,
        files: filesData
          .filter(file => file.folder_id === folder.id)
          .map(file => ({
            id: file.id,
            name: file.name,
            type: file.type as FileType,
            folderId: file.folder_id,
            size: file.size || 0,
            createdAt: new Date(file.created_at),
            tags: file.file_tag_relations.map((relation: any) => ({
              id: relation.file_tags.id,
              name: relation.file_tags.name
            }))
          }))
      }));

      console.log('Processed folders:', processedFolders);
      setFolders(processedFolders);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch folders",
        variant: "destructive",
      });
    }
  };

  const addFolder = async (name: string, type: FileType) => {
    try {
      const newFolder = await createFolder(name, type);
      setFolders(prev => [...prev, {
        id: newFolder.id,
        name: newFolder.name,
        type: newFolder.type as FileType,
        files: []
      }]);
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFolders(prev => prev.filter(folder => folder.id !== id));
      toast({
        title: "Success",
        description: "Folder deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive",
      });
    }
  };

  const addFile = async (folderId: string, fileData: Omit<File, 'id' | 'createdAt' | 'tags'>) => {
    try {
      const newFile = await uploadFile({
        ...fileData,
        folder_id: folderId,
      } as any);

      setFolders(prev => prev.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            files: [...folder.files, {
              id: newFile.id,
              name: newFile.name,
              type: newFile.type as FileType,
              folderId: newFile.folder_id,
              size: newFile.size || 0,
              createdAt: new Date(newFile.created_at),
              tags: []
            }]
          };
        }
        return folder;
      }));
    } catch (error) {
      console.error('Error adding file:', error);
      toast({
        title: "Error",
        description: "Failed to add file",
        variant: "destructive",
      });
    }
  };

  // Fetch folders and files on mount
  useEffect(() => {
    fetchFolders();
    fetchTags();
  }, []);

  return {
    folders,
    tags,
    addFolder,
    deleteFolder,
    addFile,
    deleteFile,
    addTag,
    addTagToFile,
    removeTagFromFile,
  };
};