import { Table, TableBody } from "@/components/ui/table";
import TeamActivityFilters from "./TeamActivityFilters";
import TeamActivityTableHeader from "./TeamActivityTableHeader";
import TeamActivityRow from "./TeamActivityRow";
import { useTeamActivities } from "./team-activities/useTeamActivities";
import { useActivityFilters } from "./team-activities/useActivityFilters";
import { useEffect, useState } from "react";

const TeamActivityTable = () => {
  const [sortBy, setSortBy] = useState("date_desc");
  const { 
    activities,
    filteredActivities,
    setFilteredActivities
  } = useTeamActivities();

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
  } = useActivityFilters(activities);

  const sortActivities = (activities: any[]) => {
    return [...activities].sort((a, b) => {
      switch (sortBy) {
        case "date_asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date_desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "follow_up_asc":
          if (!a.nextFollowUp) return 1;
          if (!b.nextFollowUp) return -1;
          return new Date(a.nextFollowUp).getTime() - new Date(b.nextFollowUp).getTime();
        case "follow_up_desc":
          if (!a.nextFollowUp) return 1;
          if (!b.nextFollowUp) return -1;
          return new Date(b.nextFollowUp).getTime() - new Date(a.nextFollowUp).getTime();
        default:
          return 0;
      }
    });
  };

  // Apply filters and sorting whenever filter criteria, activities, or sort option changes
  useEffect(() => {
    console.log("Applying filters and sorting with sortBy:", sortBy);
    const filtered = applyFilters(activities);
    const sorted = sortActivities(filtered);
    setFilteredActivities(sorted);
  }, [selectedTeamMember, activityType, leadSearch, selectedDate, activities, sortBy]);

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