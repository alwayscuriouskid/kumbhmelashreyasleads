import { useState } from "react";
import { Note } from "@/types/notes";

export const useNotesState = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  return {
    notes,
    setNotes,
    categories,
    setCategories,
    tags,
    setTags,
  };
};