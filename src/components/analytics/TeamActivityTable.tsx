import { Table, TableBody } from "@/components/ui/table";
import { useState } from "react";
import TeamActivityFilters from "./TeamActivityFilters";
import TeamActivityTableHeader from "./TeamActivityTableHeader";
import TeamActivityRow from "./TeamActivityRow";
import { useTeamActivities } from "@/hooks/useTeamActivities";

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

  const { data: activities = [], isLoading } = useTeamActivities(
    selectedTeamMember,
    activityType,
    leadSearch,
    selectedDate
  );

  console.log("Rendering TeamActivityTable with filters:", { 
    selectedDate, 
    selectedTeamMember, 
    activityType,
    leadSearch,
    visibleColumns 
  });

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
          {activities.length === 0 && (
            <tr>
              <td 
                colSpan={Object.values(visibleColumns).filter(Boolean).length} 
                className="text-center py-4"
              >
                {isLoading ? "Loading activities..." : "No activities found for the selected filters"}
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamActivityTable;