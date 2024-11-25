import { useNotesState } from "./notes/useNotesState";
import { useNotesOperations } from "./notes/useNotesOperations";
import { useTrashOperations } from "./notes/useTrashOperations";
import { Note } from "@/types/notes";

export const useNotes = () => {
  const {
    notes,
    setNotes,
    categories,
    setCategories,
    tags,
    setTags,
  } = useNotesState();

  const {
    fetchNotes,
    createNote,
    updateNote,
  } = useNotesOperations(setNotes, setCategories, setTags);

  const {
    deleteNote,
    fetchTrashedNotes,
    restoreNote,
  } = useTrashOperations(setNotes);

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
      console.log("Added new category:", category);
    }
  };

  return {
    notes,
    setNotes,
    categories,
    setCategories,
    tags,
    setTags,
    addCategory,
    createNote,
    updateNote,
    deleteNote,
    fetchNotes,
    fetchTrashedNotes,
    restoreNote,
  };
};