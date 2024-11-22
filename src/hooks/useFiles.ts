import { useState, useEffect } from 'react';
import { File, Folder, FileTag, FileType } from '@/types/files';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useFiles = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<FileTag[]>([]);
  const { toast } = useToast();

  // Fetch folders and files on mount
  useEffect(() => {
    fetchFolders();
    fetchTags();
  }, []);

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

      // Transform the data to match our Folder type
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
      toast({
        title: "Error",
        description: "Failed to fetch folders and files",
        variant: "destructive",
      });
    }
  };

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
      toast({
        title: "Error",
        description: "Failed to fetch tags",
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
      toast({
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
      toast({
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
      toast({
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
      toast({
        title: "Error",
        description: "Failed to delete file",
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
      toast({
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
      toast({
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
      toast({
        title: "Error",
        description: "Failed to remove tag from file",
        variant: "destructive",
      });
    }
  };

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