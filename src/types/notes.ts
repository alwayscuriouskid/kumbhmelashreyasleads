export interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  position?: { x: number; y: number };
  width?: number;
  height?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}