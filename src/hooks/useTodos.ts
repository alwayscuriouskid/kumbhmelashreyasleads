import { useState } from "react";
import { Todo, Tag, Priority } from "@/types/todo";

const defaultTags: Tag[] = [
  { id: "1", name: "presentation" },
  { id: "2", name: "quarterly" },
  { id: "3", name: "important" },
  { id: "4", name: "health" },
  { id: "5", name: "exercise" },
  { id: "6", name: "code" },
  { id: "7", name: "review" },
  { id: "8", name: "backend" },
  { id: "9", name: "groceries" },
  { id: "10", name: "weekly" },
];

const defaultTodos: Todo[] = [
  {
    id: "1",
    title: "Complete Project Presentation",
    description: "Prepare slides and demo for the quarterly review meeting",
    completed: false,
    priority: "high",
    tags: [defaultTags[0], defaultTags[1], defaultTags[2]],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Gym Session",
    description: "30 minutes cardio and strength training",
    completed: false,
    priority: "medium",
    tags: [defaultTags[3], defaultTags[4]],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Review Code PR",
    description: "Review and provide feedback on the new feature implementation",
    completed: false,
    priority: "high",
    tags: [defaultTags[5], defaultTags[6]],
    createdAt: new Date().toISOString(),
  },
];

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(defaultTodos);
  const [tags, setTags] = useState<Tag[]>(defaultTags);

  const addTodo = (todo: Omit<Todo, "id" | "createdAt">) => {
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleTodoComplete = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const addTag = (name: string) => {
    const newTag: Tag = {
      id: crypto.randomUUID(),
      name: name.toLowerCase(),
    };
    setTags((prev) => [...prev, newTag]);
    return newTag;
  };

  return {
    todos,
    tags,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoComplete,
    addTag,
  };
};