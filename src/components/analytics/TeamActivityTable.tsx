import { Table, TableBody } from "@/components/ui/table";
import { useState } from "react";
import TeamActivityFilters from "./TeamActivityFilters";
import TeamActivityTableHeader from "./TeamActivityTableHeader";
import TeamActivityRow from "./TeamActivityRow";
import { Activity } from "@/types/leads";

const dummyActivities: Activity[] = [
  {
    id: "1",
    date: new Date().toISOString(),
    time: "09:30",
    type: "call",
    description: "Initial contact call",
    teamMember: "John Smith",
    leadName: "ABC Corp",
    statusChange: { from: "prospect", to: "negotiation" },
    nextFollowUp: "2024-03-20",
    followUpOutcome: "Positive response",
    nextAction: "Send proposal",
    activityOutcome: "Client interested in LED hoardings",
    outcome: "Successful initial contact",
    notes: "Client showed strong interest in our LED hoarding solutions",
    assignedTo: "John Smith",
    contactPerson: "Raj Kumar"
  },
  {
    id: "2",
    date: new Date().toISOString(),
    time: "11:00",
    type: "meeting",
    description: "Proposal presentation",
    teamMember: "Sarah Johnson",
    leadName: "XYZ Ltd",
    statusChange: { from: "negotiation", to: "analysis" },
    nextFollowUp: "2024-03-22",
    followUpOutcome: "Budget discussion pending",
    nextAction: "Prepare revised quotation",
    activityOutcome: "Client requested detailed pricing",
    outcome: "Proposal presented successfully",
    notes: "Client requested detailed breakdown of costs",
    assignedTo: "Sarah Johnson",
    contactPerson: "Priya Singh"
  },
  {
    id: "3",
    date: new Date().toISOString(),
    time: "14:15",
    type: "email",
    description: "Quotation sent",
    teamMember: "Mike Wilson",
    leadName: "Tech Solutions",
    statusChange: { from: "analysis", to: "conclusion" },
    nextFollowUp: "2024-03-21",
    followUpOutcome: "Awaiting response",
    nextAction: "Follow up call",
    activityOutcome: "Sent detailed pricing structure",
    outcome: "Quotation sent successfully",
    notes: "Detailed pricing structure sent as requested",
    assignedTo: "Mike Wilson",
    contactPerson: "Alex Thompson"
  }
];

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
          {dummyActivities.map((activity) => (
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