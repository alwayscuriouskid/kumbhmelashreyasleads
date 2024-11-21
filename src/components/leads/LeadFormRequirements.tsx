import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Requirement } from "@/types/leads";

interface LeadFormRequirementsProps {
  requirement: Requirement;
  onRequirementChange: (field: string, value: string) => void;
}

const LeadFormRequirements = ({ requirement, onRequirementChange }: LeadFormRequirementsProps) => {
  return (
    <div className="space-y-2">
      <Label>Requirements</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="hoardings">Hoardings</Label>
          <Input
            id="hoardings"
            type="number"
            value={requirement?.hoardings || ""}
            onChange={(e) => onRequirementChange("hoardings", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="entryGates">Entry Gates</Label>
          <Input
            id="entryGates"
            type="number"
            value={requirement?.entryGates || ""}
            onChange={(e) => onRequirementChange("entryGates", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="electricPoles">Electric Poles</Label>
          <Input
            id="electricPoles"
            type="number"
            value={requirement?.electricPoles || ""}
            onChange={(e) => onRequirementChange("electricPoles", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="watchTowers">Watch Towers</Label>
          <Input
            id="watchTowers"
            type="number"
            value={requirement?.watchTowers || ""}
            onChange={(e) => onRequirementChange("watchTowers", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="chargingPoints">Charging Points</Label>
          <Input
            id="chargingPoints"
            type="number"
            value={requirement?.chargingPoints || ""}
            onChange={(e) => onRequirementChange("chargingPoints", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="skyBalloons">Sky Balloons</Label>
          <Input
            id="skyBalloons"
            type="number"
            value={requirement?.skyBalloons || ""}
            onChange={(e) => onRequirementChange("skyBalloons", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="customRequirements">Custom Requirements</Label>
          <Input
            id="customRequirements"
            value={requirement?.customRequirements || ""}
            onChange={(e) => onRequirementChange("customRequirements", e.target.value)}
            placeholder="Enter any custom requirements..."
          />
        </div>
      </div>
    </div>
  );
};

export default LeadFormRequirements;