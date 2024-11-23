import { supabase } from "@/integrations/supabase/client";
import { Note, dbToNote } from "@/types/notes";
import { useToast } from "@/components/ui/use-toast";

export const useTrashOperations = (
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
) => {
  const { toast } = useToast();

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
      return data?.map(dbToNote) || [];
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
      const formattedNote = dbToNote(data);
      setNotes(prev => [formattedNote, ...prev]);
      
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
    deleteNote,
    fetchTrashedNotes,
    restoreNote,
  };
};