import { CreateTypeDialog } from "./CreateTypeDialog";
import { CreateZoneDialog } from "./CreateZoneDialog";
import { CreateSectorDialog } from "./CreateSectorDialog";
import { ManageTypeDialog } from "./ManageTypeDialog";
import { ManageZoneDialog } from "./ManageZoneDialog";
import { ManageSectorDialog } from "./ManageSectorDialog";
import { CreateInventoryDialog } from "./CreateInventoryDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, Settings2 } from "lucide-react";

interface InventoryManagementButtonsProps {
  onSuccess: () => void;
}

export const InventoryManagementButtons = ({ onSuccess }: InventoryManagementButtonsProps) => {
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-background text-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <CreateTypeDialog onSuccess={onSuccess}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Add Type
            </DropdownMenuItem>
          </CreateTypeDialog>
          <CreateZoneDialog onSuccess={onSuccess}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Add Zone
            </DropdownMenuItem>
          </CreateZoneDialog>
          <CreateSectorDialog onSuccess={onSuccess}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Add Sector
            </DropdownMenuItem>
          </CreateSectorDialog>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-background text-foreground">
            <Settings2 className="mr-2 h-4 w-4" />
            Manage
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <ManageTypeDialog>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Manage Types
            </DropdownMenuItem>
          </ManageTypeDialog>
          <ManageZoneDialog>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Manage Zones
            </DropdownMenuItem>
          </ManageZoneDialog>
          <ManageSectorDialog>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Manage Sectors
            </DropdownMenuItem>
          </ManageSectorDialog>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateInventoryDialog onSuccess={onSuccess} />
    </div>
  );
};