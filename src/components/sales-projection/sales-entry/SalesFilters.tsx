import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

interface SalesFiltersProps {
  inventoryTypes: any[];
  selectedInventoryType: string;
  setSelectedInventoryType: (value: string) => void;
  selectedTeam: string;
  setSelectedTeam: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
}

const TEAM_LOCATIONS = ["Mumbai", "Delhi", "Chennai", "Kolkata", "Bangalore"];

export const SalesFilters = ({
  inventoryTypes,
  selectedInventoryType,
  setSelectedInventoryType,
  selectedTeam,
  setSelectedTeam,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: SalesFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Inventory Type</Label>
            <Select value={selectedInventoryType} onValueChange={setSelectedInventoryType}>
              <SelectTrigger>
                <SelectValue placeholder="Select inventory type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {inventoryTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Team Location</Label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {TEAM_LOCATIONS.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <DatePicker
              selected={startDate}
              onSelect={setStartDate}
              placeholderText="Select start date"
            />
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <DatePicker
              selected={endDate}
              onSelect={setEndDate}
              placeholderText="Select end date"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};