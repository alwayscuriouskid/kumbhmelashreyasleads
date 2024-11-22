import { useState, useEffect } from 'react';
import { File, Folder, FileTag, FileType } from '@/types/files';
import { useToast } from '@/components/ui/use-toast';
import { useFileOperations } from './useFileOperations';
import { useFileTagOperations } from './useFileTagOperations';

export const useFiles = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<FileTag[]>([]);
  const { toast } = useToast();
  
  const { fetchFolders, addFolder, deleteFolder, addFile, deleteFile } = useFileOperations({ 
    folders, 
    setFolders, 
    toast: { toast } 
  });

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