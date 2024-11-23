import { supabase } from "@/integrations/supabase/client";
import { Note, dbToNote } from "@/types/notes";
import { useToast } from "@/components/ui/use-toast";

export const useNotesOperations = (
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
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

      if (error) throw error;

      console.log("Fetched notes:", data);
      const formattedNotes = data?.map(dbToNote) || [];
      setNotes(formattedNotes);
      
      const uniqueCategories = [...new Set(data?.map(note => note.category).filter(Boolean))];
      const uniqueTags = [...new Set(data?.flatMap(note => note.tags || []))];
      
      return { uniqueCategories, uniqueTags };
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch notes",
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

      if (error) throw error;

      console.log("Created note:", data);
      const formattedNote = dbToNote(data);
      setNotes(prev => [formattedNote, ...prev]);
      
      toast({
        title: "Success",
        description: "Note created successfully",
      });

      return formattedNote;
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
        .update({
          ...updatedNote,
          position: JSON.stringify(updatedNote.position)
        })
        .eq('id', updatedNote.id)
        .select()
        .single();

      if (error) throw error;

      console.log("Updated note:", data);
      const formattedNote = dbToNote(data);
      setNotes(prev => prev.map(note => note.id === formattedNote.id ? formattedNote : note));
      
      toast({
        title: "Success",
        description: "Note updated successfully",
      });

      return formattedNote;
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    }
  };

  return {
    fetchNotes,
    createNote,
    updateNote,
  };
};