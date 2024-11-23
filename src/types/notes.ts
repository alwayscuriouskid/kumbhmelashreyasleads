import { Json } from "@/integrations/supabase/types";

export interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  position: { x: number; y: number };
  width?: number;
  height?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export const dbToNote = (dbNote: any): Note => ({
  ...dbNote,
  position: typeof dbNote.position === 'string' 
    ? JSON.parse(dbNote.position) 
    : dbNote.position || { x: 0, y: 0 }
});