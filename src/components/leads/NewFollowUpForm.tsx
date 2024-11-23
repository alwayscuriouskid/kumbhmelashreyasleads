import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FollowUp } from "@/types/leads";
import { supabase } from "@/integrations/supabase/client";
import { TeamMemberSelect } from "@/components/shared/TeamMemberSelect";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

interface NewFollowUpFormProps {
  leadId: string;
  onCancel: () => void;
  onSubmit?: (followUp: FollowUp) => void;
}

const NewFollowUpForm = ({ leadId, onCancel, onSubmit }: NewFollowUpFormProps) => {
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState<Date>();
  const [assignedTo, setAssignedTo] = useState("");
  const { toast } = useToast();

  const updateLeadWithFollowUpData = async (followUp: FollowUp) => {
    console.log("Updating lead with follow-up data:", followUp);
    
    try {
      // Format the date for database storage
      const formattedDate = followUp.nextFollowUpDate ? format(new Date(followUp.nextFollowUpDate), 'yyyy-MM-dd') : null;
      console.log("Formatted next follow-up date:", formattedDate);

      // Update leads table with follow-up information
      const { error: leadError } = await supabase
        .from('leads')
        .update({
          next_follow_up: formattedDate,
          follow_up_outcome: followUp.outcome,
          next_action: `Follow up on ${formattedDate || 'N/A'}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (leadError) {
        console.error("Error updating lead with follow-up data:", leadError);
        throw leadError;
      }

      // Store the follow-up in activities table
      const { error: activityError } = await supabase
        .from('activities')
        .insert({
          lead_id: leadId,
          type: 'follow_up',
          notes: followUp.notes,
          outcome: followUp.outcome,
          assigned_to: followUp.assignedTo,
          next_action: `Follow up on ${formattedDate || 'N/A'}`,
          next_follow_up: formattedDate
        });

      if (activityError) {
        console.error("Error storing follow-up as activity:", activityError);
        throw activityError;
      }

      console.log("Successfully updated lead and stored follow-up");
    } catch (error) {
      console.error("Failed to update lead with follow-up data:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newFollowUp: FollowUp = {
        id: `followup-${Date.now()}`,
        date: new Date().toISOString(),
        notes,
        outcome,
        nextFollowUpDate: nextFollowUpDate ? format(nextFollowUpDate, 'yyyy-MM-dd') : undefined,
        assignedTo
      };

      console.log("Creating new follow-up:", newFollowUp);
      
      // Update lead table and store follow-up
      await updateLeadWithFollowUpData(newFollowUp);
      
      // Notify parent component
      if (onSubmit) {
        onSubmit(newFollowUp);
        toast({
          title: "Success",
          description: "The follow-up has been successfully added.",
        });
      }
      
      onCancel();
    } catch (error) {
      console.error("Failed to submit follow-up:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add follow-up",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter follow-up notes..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="outcome">Outcome</Label>
        <Textarea
          id="outcome"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          placeholder="Enter outcome..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Next Follow-up Date</Label>
        <div className="w-full">
          <DatePicker
            selected={nextFollowUpDate}
            onSelect={setNextFollowUpDate}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Assigned To</Label>
        <TeamMemberSelect
          value={assignedTo}
          onChange={setAssignedTo}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Follow-up</Button>
      </div>
    </form>
  );
};

export default NewFollowUpForm;