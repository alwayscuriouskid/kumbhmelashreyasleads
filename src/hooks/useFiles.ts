import { useState } from 'react';
import { File, Folder, FileTag, FileType } from '@/types/files';

const defaultFolders: Folder[] = [
  { id: '1', name: 'Images', type: 'image', files: [] },
  { id: '2', name: 'Documents', type: 'document', files: [] },
  { id: '3', name: 'Presentations', type: 'presentation', files: [] },
];

export const useFiles = () => {
  const [folders, setFolders] = useState<Folder[]>(defaultFolders);
  const [tags, setTags] = useState<FileTag[]>([]);

  const addFolder = (name: string, type: FileType) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      type,
      files: [],
    };
    setFolders([...folders, newFolder]);
    console.log('Added new folder:', newFolder);
  };

  const deleteFolder = (id: string) => {
    setFolders(folders.filter(folder => folder.id !== id));
    console.log('Deleted folder:', id);
  };

  const addFile = (folderId: string, file: Omit<File, 'id' | 'createdAt' | 'tags'>) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          files: [...folder.files, {
            ...file,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            tags: [],
          }],
        };
      }
      return folder;
    }));
    console.log('Added file to folder:', folderId);
  };

  const deleteFile = (folderId: string, fileId: string) => {
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
  };

  const addTag = (name: string) => {
    const newTag: FileTag = {
      id: crypto.randomUUID(),
      name,
    };
    setTags([...tags, newTag]);
    return newTag;
  };

  const addTagToFile = (folderId: string, fileId: string, tagId: string) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          files: folder.files.map(file => {
            if (file.id === fileId) {
              const tag = tags.find(t => t.id === tagId);
              if (tag && !file.tags.some(t => t.id === tagId)) {
                return {
                  ...file,
                  tags: [...file.tags, tag],
                };
              }
            }
            return file;
          }),
        };
      }
      return folder;
    }));
    console.log('Added tag to file:', { folderId, fileId, tagId });
  };

  const removeTagFromFile = (folderId: string, fileId: string, tagId: string) => {
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
    console.log('Removed tag from file:', { folderId, fileId, tagId });
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