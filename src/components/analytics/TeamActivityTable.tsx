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
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
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

  const validateActivityType = (type: string): Activity['type'] => {
    const validTypes: Activity['type'][] = ['call', 'meeting', 'email', 'note', 'status_change', 'follow_up'];
    return validTypes.includes(type as Activity['type']) 
      ? (type as Activity['type']) 
      : 'note';
  };

  const transformActivity = (activity: any): Activity => ({
    id: activity.id,
    date: activity.created_at,
    time: new Date(activity.created_at).toLocaleTimeString(),
    type: validateActivityType(activity.type),
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
  });

  const fetchActivities = async () => {
    try {
      console.log('Fetching activities...');
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select(`
          *,
          lead:leads (
            id,
            client_name,
            next_follow_up,
            follow_up_outcome,
            next_action
          )
        `)
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;

      console.log('Fetched activities:', activitiesData);
      const transformedActivities = activitiesData.map(transformActivity);
      setActivities(transformedActivities);
      applyFilters(transformedActivities, selectedTeamMember, activityType, leadSearch, selectedDate);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast({
        title: "Error",
        description: "Failed to load activities",
        variant: "destructive",
      });
    }
  };

  const applyFilters = (
    activities: Activity[],
    teamMember: string,
    type: string,
    search: string,
    date?: Date
  ) => {
    console.log('Applying filters:', { teamMember, type, search, date });
    
    let filtered = [...activities];

    // Filter by team member
    if (teamMember !== 'all') {
      filtered = filtered.filter(activity => activity.teamMember === teamMember);
    }

    // Filter by activity type
    if (type !== 'all') {
      filtered = filtered.filter(activity => activity.type === type);
    }

    // Filter by date
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      filtered = filtered.filter(activity => 
        activity.date.toString().includes(dateStr)
      );
    }

    // Search by lead name
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(activity => 
        activity.leadName?.toLowerCase().includes(searchLower) ||
        activity.description?.toLowerCase().includes(searchLower) ||
        activity.contactPerson?.toLowerCase().includes(searchLower)
      );
    }

    console.log('Filtered activities:', filtered);
    setFilteredActivities(filtered);
  };

  useEffect(() => {
    fetchActivities();

    // Subscribe to real-time updates for activities
    const activitiesChannel = supabase
      .channel('activities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities'
        },
        async (payload) => {
          console.log('Real-time activity update received:', payload);
          await fetchActivities();
        }
      )
      .subscribe((status) => {
        console.log('Activities subscription status:', status);
      });

    // Subscribe to real-time updates for leads (since we need lead data too)
    const leadsChannel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads'
        },
        async (payload) => {
          console.log('Real-time lead update received:', payload);
          await fetchActivities();
        }
      )
      .subscribe((status) => {
        console.log('Leads subscription status:', status);
      });

    return () => {
      supabase.removeChannel(activitiesChannel);
      supabase.removeChannel(leadsChannel);
    };
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters(activities, selectedTeamMember, activityType, leadSearch, selectedDate);
  }, [selectedTeamMember, activityType, leadSearch, selectedDate, activities]);

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
          {filteredActivities.map((activity) => (
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