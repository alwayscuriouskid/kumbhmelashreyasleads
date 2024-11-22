import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import TeamActivityFilters from "./TeamActivityFilters";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Activity {
  id: string;
  type: string;
  description: string;
  time: string;
  teamMember: string;
  date: string;
  leadName: string;
  statusChange?: {
    from: string;
    to: string;
  };
  nextFollowUp?: string;
  followUpOutcome?: string;
  nextAction?: string;
  activityOutcome?: string;
}

const TeamActivityTable = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('all');
  const [activityType, setActivityType] = useState<string>('all');
  const [leadSearch, setLeadSearch] = useState<string>('');
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

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["team-activities", selectedTeamMember, activityType, leadSearch, selectedDate],
    queryFn: async () => {
      console.log("Fetching activities with filters:", { 
        selectedTeamMember, 
        activityType,
        leadSearch,
        selectedDate 
      });

      // In a real implementation, we would fetch this data from the database
      // For now, returning mock data
      return [];
    }
  });

  console.log("Rendering TeamActivityTable with filters:", { 
    selectedDate, 
    selectedTeamMember, 
    activityType,
    leadSearch,
    visibleColumns 
  });

  const filteredActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.date);

    // Team member filter
    if (selectedTeamMember !== "all" && activity.teamMember !== selectedTeamMember) {
      return false;
    }

    // Activity type filter
    if (activityType !== 'all' && activity.type !== activityType) {
      return false;
    }

    // Lead search filter
    if (leadSearch && !activity.leadName.toLowerCase().includes(leadSearch.toLowerCase())) {
      return false;
    }

    // Date filter
    if (selectedDate) {
      const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
      const activityDateStr = format(activityDate, "yyyy-MM-dd");

      if (isToday(selectedDate)) {
        return isToday(activityDate);
      } else if (isYesterday(selectedDate)) {
        return isYesterday(activityDate);
      } else if (isThisWeek(selectedDate)) {
        return isThisWeek(activityDate);
      } else {
        return activityDateStr === selectedDateStr;
      }
    }

    return true;
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-500",
      approved: "bg-green-500/20 text-green-500",
      rejected: "bg-red-500/20 text-red-500",
      followup: "bg-blue-500/20 text-blue-500"
    };
    return colors[status] || "bg-gray-500/20 text-gray-500";
  };

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
        <TableHeader>
          <TableRow>
            {visibleColumns.time && <TableHead>Time</TableHead>}
            {visibleColumns.type && <TableHead>Type</TableHead>}
            {visibleColumns.description && <TableHead>Description</TableHead>}
            {visibleColumns.teamMember && <TableHead>Team Member</TableHead>}
            {visibleColumns.leadName && <TableHead>Lead</TableHead>}
            {visibleColumns.statusChange && <TableHead>Status Change</TableHead>}
            {visibleColumns.nextFollowUp && <TableHead>Next Follow-up</TableHead>}
            {visibleColumns.followUpOutcome && <TableHead>Follow-up Outcome</TableHead>}
            {visibleColumns.nextAction && <TableHead>Next Action</TableHead>}
            {visibleColumns.activityOutcome && <TableHead>Activity Outcome</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredActivities.map((activity) => (
            <TableRow key={activity.id}>
              {visibleColumns.time && <TableCell>{activity.time}</TableCell>}
              {visibleColumns.type && 
                <TableCell className="capitalize">{activity.type.replace('_', ' ')}</TableCell>
              }
              {visibleColumns.description && <TableCell>{activity.description}</TableCell>}
              {visibleColumns.teamMember && 
                <TableCell className="capitalize">{activity.teamMember}</TableCell>
              }
              {visibleColumns.leadName && <TableCell>{activity.leadName}</TableCell>}
              {visibleColumns.statusChange && (
                <TableCell>
                  {activity.statusChange && (
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusBadge(activity.statusChange.from)}>
                        {activity.statusChange.from}
                      </Badge>
                      →
                      <Badge className={getStatusBadge(activity.statusChange.to)}>
                        {activity.statusChange.to}
                      </Badge>
                    </div>
                  )}
                </TableCell>
              )}
              {visibleColumns.nextFollowUp && 
                <TableCell>{activity.nextFollowUp || "-"}</TableCell>
              }
              {visibleColumns.followUpOutcome && 
                <TableCell>{activity.followUpOutcome || "-"}</TableCell>
              }
              {visibleColumns.nextAction && 
                <TableCell>{activity.nextAction || "-"}</TableCell>
              }
              {visibleColumns.activityOutcome && 
                <TableCell>{activity.activityOutcome || "-"}</TableCell>
              }
            </TableRow>
          ))}
          {filteredActivities.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={Object.values(visibleColumns).filter(Boolean).length} 
                className="text-center py-4"
              >
                No activities found for the selected filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamActivityTable;