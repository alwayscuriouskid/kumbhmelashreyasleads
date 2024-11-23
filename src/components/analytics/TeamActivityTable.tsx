import { Table, TableBody } from "@/components/ui/table";
import { useState, useEffect } from "react";
import TeamActivityFilters from "./TeamActivityFilters";
import TeamActivityTableHeader from "./TeamActivityTableHeader";
import TeamActivityRow from "./TeamActivityRow";
import { Activity } from "@/types/leads";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TeamActivityTable = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('all');
  const [activityType, setActivityType] = useState<string>('all');
  const [leadSearch, setLeadSearch] = useState<string>('');
  const { toast } = useToast();
  const [visibleColumns, setVisibleColumns] = useState({
    time: true,
    type: true,
    description: true,
    teamMember: true,
    leadName: true,
    statusChange: true,
    nextFollowUp: true,
    followUpOutcome: true,
    nextAction: true,
    activityOutcome: true
  });

  const fetchActivities = async () => {
    try {
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select(`
          *,
          lead:leads (
            client_name,
            next_follow_up,
            follow_up_outcome,
            next_action
          )
        `)
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;

      const transformedActivities = activitiesData.map(activity => ({
        id: activity.id,
        date: activity.created_at,
        time: new Date(activity.created_at).toLocaleTimeString(),
        type: activity.type,
        description: activity.notes,
        teamMember: activity.assigned_to,
        leadName: activity.lead?.client_name,
        nextFollowUp: activity.lead?.next_follow_up,
        followUpOutcome: activity.lead?.follow_up_outcome,
        nextAction: activity.lead?.next_action,
        activityOutcome: activity.outcome,
        outcome: activity.outcome,
        notes: activity.notes,
        assignedTo: activity.assigned_to,
        contactPerson: activity.contact_person
      }));

      setActivities(transformedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Error",
        description: "Failed to load activities",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchActivities();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('team-activities')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities'
        },
        (payload) => {
          console.log('Real-time activity update received:', payload);
          fetchActivities(); // Refresh the entire list when we get an update
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-4">
      <TeamActivityFilters
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        selectedTeamMember={selectedTeamMember}
        onTeamMemberSelect={setSelectedTeamMember}
        activityType={activityType}
        onActivityTypeSelect={setActivityType}
        leadSearch={leadSearch}
        onLeadSearchChange={setLeadSearch}
        visibleColumns={visibleColumns}
        onToggleColumn={(columnKey) => 
          setVisibleColumns(prev => ({ ...prev, [columnKey]: !prev[columnKey] }))
        }
      />

      <Table>
        <TeamActivityTableHeader visibleColumns={visibleColumns} />
        <TableBody>
          {activities.map((activity) => (
            <TeamActivityRow 
              key={activity.id}
              activity={activity}
              visibleColumns={visibleColumns}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamActivityTable;