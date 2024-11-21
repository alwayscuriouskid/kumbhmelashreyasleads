export interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  position?: { x: number; y: number };
  width?: number;
  height?: number;
}