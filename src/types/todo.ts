export type Priority = "low" | "medium" | "high";

export interface Tag {
  id: string;
  name: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  tags: Tag[];
  createdAt: string;
  deadline?: string;
}