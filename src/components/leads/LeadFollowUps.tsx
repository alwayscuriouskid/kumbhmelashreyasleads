import { useState } from "react";
import { FollowUp, Activity } from "@/types/leads";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import NewFollowUpForm from "./NewFollowUpForm";
import ActivityTracker from "./ActivityTracker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LeadFollowUpsProps {
  leadId: string;
  followUps: FollowUp[];
  onFollowUpSubmit?: (followUp: FollowUp) => void;
  onActivityAdd?: (activity: Activity) => void;
  contactPerson?: string;
  onLeadUpdate?: (updates: any) => void;
}

const LeadFollowUps = ({ 
  leadId, 
  followUps = [], 
  onFollowUpSubmit,
  onActivityAdd,
  contactPerson = "",
  onLeadUpdate
}: LeadFollowUpsProps) => {
  const [showNewForm, setShowNewForm] = useState(false);
  const { toast } = useToast();

  const updateLeadTable = async (updates: any) => {
    try {
      // Validate UUID format
      if (!leadId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.error("Invalid UUID format for leadId:", leadId);
        toast({
          title: "Error",
          description: "Invalid lead ID format",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId);

      if (error) {
        console.error("Error updating lead:", error);
        toast({
          title: "Error",
          description: "Failed to update lead information",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Lead table updated successfully:", updates);
      onLeadUpdate?.(updates);
      
      toast({
        title: "Success",
        description: "Lead information updated successfully",
      });
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const handleFollowUpSubmit = async (followUp: FollowUp) => {
    console.log("Submitting follow-up:", followUp);
    onFollowUpSubmit?.(followUp);

    // Update lead table with latest follow-up information
    const updates = {
      next_follow_up: followUp.nextFollowUpDate,
      follow_up_outcome: followUp.outcome
    };

    await updateLeadTable(updates);
    setShowNewForm(false);
  };

  const handleActivityAdd = async (activity: Activity) => {
    console.log("Adding new activity:", activity);
    onActivityAdd?.(activity);

    // Update lead table with latest activity information
    const updates = {
      next_action: activity.nextAction,
      follow_up_outcome: activity.outcome
    };

    await updateLeadTable(updates);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto px-2 sm:px-6">
      <div className="flex flex-row items-center justify-between gap-2 flex-wrap">
        <h3 className="text-lg font-semibold">Follow-ups & Activities</h3>
        <Button
          onClick={() => setShowNewForm(!showNewForm)}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Follow-up
        </Button>
      </div>

      {showNewForm && (
        <Card className="border-dashed animate-fade-in">
          <CardContent className="pt-6">
            <Tabs defaultValue="followup" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="followup">Follow-up</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="followup">
                <NewFollowUpForm
                  leadId={leadId}
                  onCancel={() => setShowNewForm(false)}
                  onSubmit={handleFollowUpSubmit}
                />
              </TabsContent>
              <TabsContent value="activity">
                <ActivityTracker
                  leadId={leadId}
                  onActivityAdd={handleActivityAdd}
                  contactPerson={contactPerson}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <ScrollArea className="h-[400px] w-full rounded-md border">
        <div className="space-y-3 p-2 sm:p-4">
          {followUps.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No follow-ups yet</p>
          ) : (
            followUps.map((followUp) => (
              <Card key={followUp.id} className="animate-fade-in">
                <CardHeader className="p-3 sm:p-4 space-y-1">
                  <div className="flex flex-row justify-between items-start gap-2 flex-wrap">
                    <CardTitle className="text-sm font-medium">
                      {new Date(followUp.date).toLocaleDateString()}
                    </CardTitle>
                    {followUp.nextFollowUpDate && (
                      <span className="text-xs text-muted-foreground">
                        Next: {new Date(followUp.nextFollowUpDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <p className="text-sm break-words">{followUp.notes}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Outcome: {followUp.outcome}
                  </p>
                  {followUp.assignedTo && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Assigned to: {followUp.assignedTo}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LeadFollowUps;