import { useState, useEffect } from "react";
import { Note } from "@/types/notes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      console.log("Fetching notes...");
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log("Fetched notes:", data);
      setNotes(data || []);

      // Extract unique categories and tags
      const uniqueCategories = [...new Set(data?.map(note => note.category).filter(Boolean))];
      const uniqueTags = [...new Set(data?.flatMap(note => note.tags || []))];
      
      setCategories(uniqueCategories);
      setTags(uniqueTags);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive",
      });
    }
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
      console.log("Added new category:", category);
    }
  };

  const createNote = async (noteData: Omit<Note, "id" | "createdAt">) => {
    try {
      console.log("Creating note:", noteData);
      const { data, error } = await supabase
        .from('notes')
        .insert([noteData])
        .select()
        .single();

      if (error) throw error;

      console.log("Created note:", data);
      setNotes(prev => [data, ...prev]);
      
      toast({
        title: "Success",
        description: "Note created successfully",
      });

      return data;
    } catch (error) {
      console.error("Error creating note:", error);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    }
  };

  const updateNote = async (updatedNote: Note) => {
    try {
      console.log("Updating note:", updatedNote);
      const { data, error } = await supabase
        .from('notes')
        .update(updatedNote)
        .eq('id', updatedNote.id)
        .select()
        .single();

      if (error) throw error;

      console.log("Updated note:", data);
      setNotes(prev => prev.map(note => note.id === data.id ? data : note));
      
      toast({
        title: "Success",
        description: "Note updated successfully",
      });

      return data;
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      console.log("Soft deleting note:", noteId);
      const { error } = await supabase
        .from('notes')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      toast({
        title: "Success",
        description: "Note moved to trash",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const fetchTrashedNotes = async () => {
    try {
      console.log("Fetching trashed notes...");
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (error) throw error;

      console.log("Fetched trashed notes:", data);
      return data;
    } catch (error) {
      console.error("Error fetching trashed notes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch trashed notes",
        variant: "destructive",
      });
      return [];
    }
  };

  const restoreNote = async (noteId: string) => {
    try {
      console.log("Restoring note:", noteId);
      const { data, error } = await supabase
        .from('notes')
        .update({ deleted_at: null })
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;

      console.log("Restored note:", data);
      setNotes(prev => [data, ...prev]);
      
      toast({
        title: "Success",
        description: "Note restored successfully",
      });
    } catch (error) {
      console.error("Error restoring note:", error);
      toast({
        title: "Error",
        description: "Failed to restore note",
        variant: "destructive",
      });
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
    fetchTrashedNotes,
    restoreNote,
  };
};