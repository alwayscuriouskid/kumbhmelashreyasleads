import { useState } from "react";
import { Lead } from "@/types/leads";
import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown, ChevronUp, Pencil, Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import LeadRowContent from "./LeadRowContent";
import LeadRowExpanded from "./LeadRowExpanded";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LeadRowProps {
  lead: Lead;
  visibleColumns: Record<string, boolean>;
  onUpdate?: (updatedLead: Lead) => void;
  customStatuses: string[];
}

const LeadRow = ({ lead, visibleColumns, onUpdate, customStatuses }: LeadRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Lead>(lead);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
    console.log("Editing mode enabled for lead:", lead.id);
  };

  const handleSave = () => {
    onUpdate?.(editedLead);
    setIsEditing(false);
    console.log("Saving changes for lead:", editedLead);
    toast({
      title: "Lead Updated",
      description: "The lead information has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditedLead(lead);
    setIsEditing(false);
    console.log("Cancelled editing for lead:", lead.id);
  };

  const handleInputChange = (field: keyof Lead, value: string) => {
    setEditedLead((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log(`Updated ${field} to:`, value);
  };

  const handleFollowUpSubmit = (newFollowUp: any) => {
    const updatedLead = {
      ...editedLead,
      followUps: [...(editedLead.followUps || []), newFollowUp],
    };
    onUpdate?.(updatedLead);
    setEditedLead(updatedLead);
    console.log("Added new follow-up:", newFollowUp);
  };

  return (
    <>
      <TableRow className="group hover:bg-muted/50">
        <LeadRowContent 
          lead={lead}
          visibleColumns={visibleColumns}
          isEditing={isEditing}
          editedLead={editedLead}
          handleInputChange={handleInputChange}
          customStatuses={customStatuses}
        />

        <TableCell className="sticky right-0 bg-background/80 backdrop-blur-sm w-[60px] p-0">
          <div className="flex items-center justify-center h-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuItem onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? "Hide Details" : "Show Details"}
                </DropdownMenuItem>
                {!isEditing ? (
                  <DropdownMenuItem onClick={handleEdit}>
                    Edit Lead
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem onClick={handleSave}>
                      Save Changes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCancel}>
                      Cancel Edit
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>
      
      {isExpanded && (
        <LeadRowExpanded 
          lead={editedLead}
          visibleColumns={visibleColumns}
          onFollowUpSubmit={handleFollowUpSubmit}
        />
      )}
    </>
  );
};

export default LeadRow;