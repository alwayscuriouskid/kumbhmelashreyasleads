import { Table, TableBody } from "@/components/ui/table";
import TeamActivityFilters from "./TeamActivityFilters";
import TeamActivityTableHeader from "./TeamActivityTableHeader";
import TeamActivityRow from "./TeamActivityRow";
import { useTeamActivities } from "@/hooks/useTeamActivities";
import { useActivityFilters } from "./team-activities/useActivityFilters";
import { useState, useEffect } from "react";
import { Activity } from "@/types/activity";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TeamActivityTable = () => {
  const [sortBy, setSortBy] = useState("date_desc");
  const [nextActionDateFilter, setNextActionDateFilter] = useState<Date>();
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  
  const { 
    selectedDate,
    setSelectedDate,
    selectedTeamMember,
    setSelectedTeamMember,
    activityType,
    setActivityType,
    leadSearch,
    setLeadSearch,
    visibleColumns,
    setVisibleColumns,
    applyFilters
  } = useActivityFilters();

  const { data: activities = [], isLoading, error, refetch } = useTeamActivities(
    selectedTeamMember,
    activityType,
    leadSearch,
    selectedDate,
    nextActionDateFilter
  );

  // Add real-time subscription for activities updates
  useEffect(() => {
    console.log("Setting up real-time subscription for activities");
    
    const channel = supabase
      .channel('activities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities'
        },
        (payload) => {
          console.log('Activity update received:', payload);
          refetch();
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const sortActivities = (activities: Activity[]) => {
    return [...activities].sort((a, b) => {
      switch (sortBy) {
        case "date_asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "date_desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "next_action_asc":
          return new Date(a.next_action_date || 0).getTime() - new Date(b.next_action_date || 0).getTime();
        case "next_action_desc":
          return new Date(b.next_action_date || 0).getTime() - new Date(a.next_action_date || 0).getTime();
        default:
          return 0;
      }
    });
  };

  // Update filtered activities when data changes
  useEffect(() => {
    if (activities) {
      console.log("Updating filtered activities with new data:", activities);
      const filtered = applyFilters(activities);
      const sorted = sortActivities(filtered);
      setFilteredActivities(sorted);
    }
  }, [activities, selectedTeamMember, activityType, leadSearch, selectedDate, nextActionDateFilter, sortBy, applyFilters]);

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  if (error) {
    console.error("Error loading activities:", error);
    toast.error("Failed to load activities");
    return <div>Error loading activities. Please try again.</div>;
  }

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
        sortBy={sortBy}
        onSortChange={setSortBy}
        nextActionDateFilter={nextActionDateFilter}
        onNextActionDateSelect={setNextActionDateFilter}
      />

      <div className="table-container">
        <Table>
          <TeamActivityTableHeader visibleColumns={visibleColumns} />
          <TableBody>
            {filteredActivities.length === 0 ? (
              <tr>
                <td colSpan={Object.keys(visibleColumns).filter(key => visibleColumns[key]).length} className="p-4 text-center text-muted-foreground">
                  No activities found
                </td>
              </tr>
            ) : (
              filteredActivities.map((activity) => (
                <TeamActivityRow 
                  key={activity.id}
                  activity={activity}
                  visibleColumns={visibleColumns}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeamActivityTable;