import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Activity } from "@/types/leads";
import { supabase } from "@/integrations/supabase/client";
import { TeamMemberSelect } from "@/components/shared/TeamMemberSelect";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

interface NewFollowUpFormProps {
  leadId: string;
  onCancel: () => void;
  onSubmit?: (activity: Activity) => void;
}

const NewFollowUpForm = ({ leadId, onCancel, onSubmit }: NewFollowUpFormProps) => {
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState<Date>();
  const [assignedTo, setAssignedTo] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newActivity: Activity = {
        id: `activity-${Date.now()}`,
        type: 'follow_up',
        date: new Date().toISOString(),
        notes,
        outcome,
        nextAction: `Follow up on ${nextFollowUpDate ? format(nextFollowUpDate, 'PP') : 'N/A'}`,
        next_action_date: nextFollowUpDate ? format(nextFollowUpDate, 'yyyy-MM-dd') : undefined,
        assignedTo,
        contactPerson: '',
      };

      // Store the activity in activities table
      const { error: activityError } = await supabase
        .from('activities')
        .insert({
          lead_id: leadId,
          type: 'follow_up',
          notes: newActivity.notes,
          outcome: newActivity.outcome,
          assigned_to: newActivity.assignedTo,
          next_action: newActivity.nextAction,
          next_follow_up: newActivity.next_action_date
        });

      if (activityError) throw activityError;

      if (onSubmit) {
        onSubmit(newActivity);
      }
      
      onCancel();
      toast({
        title: "Success",
        description: "Follow-up has been added successfully.",
      });
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