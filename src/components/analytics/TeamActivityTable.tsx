import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface Activity {
  id: string;
  type: string;
  description: string;
  time: string;
  teamMember: string;
  date: string;
}

// This would typically come from your API/database
const activities: Activity[] = [
  {
    id: "1",
    type: "call",
    description: "Follow-up call with ABC Corp",
    time: "10:00 AM",
    teamMember: "john",
    date: "2024-03-20",
  },
  {
    id: "2",
    type: "meeting",
    description: "Client presentation for XYZ Ltd",
    time: "2:00 PM",
    teamMember: "jane",
    date: "2024-03-20",
  },
  {
    id: "3",
    type: "email",
    description: "Sent proposal to Tech Solutions",
    time: "11:30 AM",
    teamMember: "mike",
    date: "2024-03-20",
  },
];

interface TeamActivityTableProps {
  selectedDate?: Date;
  selectedTeamMember?: string;
}

const TeamActivityTable = ({ selectedDate, selectedTeamMember }: TeamActivityTableProps) => {
  console.log("Rendering TeamActivityTable with filters:", { selectedDate, selectedTeamMember });

  const filteredActivities = activities.filter((activity) => {
    if (selectedTeamMember && selectedTeamMember !== "all" && activity.teamMember !== selectedTeamMember) {
      return false;
    }
    if (selectedDate && activity.date !== format(selectedDate, "yyyy-MM-dd")) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Team Member Activities</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Team Member</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredActivities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>{activity.time}</TableCell>
              <TableCell className="capitalize">{activity.type}</TableCell>
              <TableCell>{activity.description}</TableCell>
              <TableCell className="capitalize">{activity.teamMember}</TableCell>
            </TableRow>
          ))}
          {filteredActivities.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
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