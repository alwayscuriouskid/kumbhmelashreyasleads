import { useState, useEffect } from "react";
import { FollowUp, Activity } from "@/types/leads";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import NewFollowUpForm from "./NewFollowUpForm";
import ActivityTracker from "../analytics/ActivityTracker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ActivityList from "./ActivityList";

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
  }, [leadId]);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log("Fetched activities:", data);
      setActivities(data.map(activity => ({
        id: activity.id,
        type: activity.type,
        date: activity.created_at,
        notes: activity.notes || '',
        outcome: activity.outcome || '',
        startTime: activity.start_time,
        endTime: activity.end_time,
        assignedTo: activity.assigned_to || '',
        nextAction: activity.next_action,
        contactPerson: activity.contact_person || '',
        location: activity.location,
        callType: activity.call_type as 'incoming' | 'outgoing' | undefined
      })));
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast({
        title: "Error",
        description: "Failed to load activities",
        variant: "destructive",
      });
    }
  };

  const updateLeadTable = async (updates: any) => {
    try {
      console.log("Updating lead table with:", updates);
      
      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId);

      if (error) {
        console.error("Error updating lead:", error);
        throw error;
      }

      console.log("Lead table updated successfully");
      onLeadUpdate?.(updates);
      
      toast({
        title: "Success",
        description: "Lead information updated successfully",
      });
    } catch (error) {
      console.error("Error updating lead:", error);
      toast({
        title: "Error",
        description: "Failed to update lead information",
        variant: "destructive",
      });
    }
  };

  const handleFollowUpSubmit = async (followUp: FollowUp) => {
    console.log("Submitting follow-up:", followUp);
    
    try {
      // Update lead table with follow-up information
      const updates = {
        next_follow_up: followUp.nextFollowUpDate,
        follow_up_outcome: followUp.outcome,
        updated_at: new Date().toISOString()
      };

      await updateLeadTable(updates);
      onFollowUpSubmit?.(followUp);
      setShowNewForm(false);
    } catch (error) {
      console.error("Failed to submit follow-up:", error);
      toast({
        title: "Error",
        description: "Failed to add follow-up",
        variant: "destructive",
      });
    }
  };

  const handleActivityAdd = async (activity: Activity) => {
    console.log("Adding new activity:", activity);
    setActivities(prev => [activity, ...prev]);
    onActivityAdd?.(activity);
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
          {activities.length === 0 && followUps.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No activities or follow-ups yet</p>
          ) : (
            <>
              {activities.map((activity) => (
                <Card key={activity.id} className="animate-fade-in">
                  <CardHeader className="p-3 sm:p-4 space-y-1">
                    <div className="flex flex-row justify-between items-start gap-2 flex-wrap">
                      <CardTitle className="text-sm font-medium">
                        {new Date(activity.date).toLocaleDateString()} - {activity.type}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0">
                    <p className="text-sm break-words">{activity.notes}</p>
                    {activity.outcome && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Outcome: {activity.outcome}
                      </p>
                    )}
                    {activity.assignedTo && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Assigned to: {activity.assignedTo}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
              {followUps.map((followUp) => (
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
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LeadFollowUps;