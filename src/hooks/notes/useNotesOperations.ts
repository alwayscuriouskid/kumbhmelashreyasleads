import { supabase } from "@/integrations/supabase/client";
import { Note, dbToNote } from "@/types/notes";
import { useToast } from "@/hooks/use-toast";

export const useNotesOperations = (
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>,
  setCategories: React.Dispatch<React.SetStateAction<string[]>>,
  setTags: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const { toast } = useToast();

  const fetchNotes = async () => {
    try {
      console.log("Fetching notes...");
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
        toast({
          title: "Error",
          description: "Failed to fetch notes. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      if (!data) {
        console.log("No notes found");
        setNotes([]);
        setCategories([]);
        setTags([]);
        return { uniqueCategories: [], uniqueTags: [] };
      }

      console.log("Fetched notes:", data);
      const formattedNotes = data.map(dbToNote);
      setNotes(formattedNotes);
      
      // Extract unique categories and tags
      const uniqueCategories = [...new Set(data.map(note => note.category).filter(Boolean))];
      const uniqueTags = [...new Set(data.flatMap(note => note.tags || []))];
      
      setCategories(uniqueCategories);
      setTags(uniqueTags);
      
      return { uniqueCategories, uniqueTags };
    } catch (error) {
      console.error("Error in fetchNotes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch notes. Please try again.",
        variant: "destructive",
      });
      return { uniqueCategories: [], uniqueTags: [] };
    }
  };

  const createNote = async (noteData: Omit<Note, "id">) => {
    try {
      console.log("Creating note:", noteData);
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          ...noteData,
          position: JSON.stringify(noteData.position)
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating note:", error);
        toast({
          title: "Error",
          description: "Failed to create note",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Created note:", data);
      const formattedNote = dbToNote(data);
      setNotes(prev => [formattedNote, ...prev]);
      
      // Update categories and tags
      if (noteData.category) {
        setCategories(prev => [...new Set([...prev, noteData.category!])]);
      }
      if (noteData.tags?.length) {
        setTags(prev => [...new Set([...prev, ...noteData.tags!])]);
      }

      return formattedNote;
    } catch (error) {
      console.error("Error in createNote:", error);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateNote = async (updatedNote: Note) => {
    try {
      console.log("Updating note in Supabase:", updatedNote);
      
      // Prepare the note data for update
      const noteForUpdate = {
        ...updatedNote,
        position: JSON.stringify(updatedNote.position),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('notes')
        .update(noteForUpdate)
        .eq('id', updatedNote.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating note in Supabase:", error);
        toast({
          title: "Error",
          description: "Failed to update note",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Note updated successfully in Supabase:", data);
      const formattedNote = dbToNote(data);
      
      // Update local state
      setNotes(prev => prev.map(note => 
        note.id === formattedNote.id ? formattedNote : note
      ));
      
      // Update categories and tags if needed
      if (updatedNote.category) {
        setCategories(prev => [...new Set([...prev, updatedNote.category!])]);
      }
      if (updatedNote.tags?.length) {
        setTags(prev => [...new Set([...prev, ...updatedNote.tags!])]);
      }

      return formattedNote;
    } catch (error) {
      console.error("Error in updateNote:", error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    fetchNotes,
    createNote,
    updateNote,
  };
};