export type FileType = 'image' | 'document' | 'presentation';

export interface FileTag {
  id: string;
  name: string;
  color?: string;
}

export interface File {
  id: string;
  name: string;
  type: FileType;
  folderId: string;
  tags: FileTag[];
  createdAt: Date;
  size?: number;
}

export interface Folder {
  id: string;
  name: string;
  type: FileType;
  files: File[];
}