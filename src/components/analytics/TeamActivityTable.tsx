import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";

interface Activity {
  id: string;
  type: string;
  description: string;
  time: string;
  teamMember: string;
  date: string;
  leadName: string; // Added lead name field
}

// Updated mock data to include lead information
const activities: Activity[] = [
  {
    id: "1",
    type: "call",
    description: "Follow-up call with ABC Corp",
    time: "10:00 AM",
    teamMember: "john",
    date: "2024-03-20",
    leadName: "ABC Corp"
  },
  {
    id: "2",
    type: "meeting",
    description: "Client presentation for XYZ Ltd",
    time: "2:00 PM",
    teamMember: "jane",
    date: "2024-03-20",
    leadName: "XYZ Ltd"
  },
  {
    id: "3",
    type: "email",
    description: "Sent proposal to Tech Solutions",
    time: "11:30 AM",
    teamMember: "mike",
    date: "2024-03-20",
    leadName: "Tech Solutions"
  },
];

interface TeamActivityTableProps {
  selectedDate?: Date;
  selectedTeamMember?: string;
}

const TeamActivityTable = ({ selectedDate: propSelectedDate, selectedTeamMember: propSelectedTeamMember }: TeamActivityTableProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(propSelectedDate);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>(propSelectedTeamMember || 'all');

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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Team Member Activities</h3>
        <div className="flex gap-4">
          <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select team member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="john">John Doe</SelectItem>
              <SelectItem value="jane">Jane Smith</SelectItem>
              <SelectItem value="mike">Mike Johnson</SelectItem>
            </SelectContent>
          </Select>
          
          <DatePicker
            selected={selectedDate}
            onSelect={setSelectedDate}
            placeholderText="Select date"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Team Member</TableHead>
            <TableHead>Lead</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredActivities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>{activity.time}</TableCell>
              <TableCell className="capitalize">{activity.type}</TableCell>
              <TableCell>{activity.description}</TableCell>
              <TableCell className="capitalize">{activity.teamMember}</TableCell>
              <TableCell>{activity.leadName}</TableCell>
            </TableRow>
          ))}
          {filteredActivities.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
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