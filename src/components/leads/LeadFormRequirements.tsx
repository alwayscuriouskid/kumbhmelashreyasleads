import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Requirement } from "@/types/leads";

interface LeadFormRequirementsProps {
  requirement: Requirement;
  onRequirementChange: (field: string, value: string) => void;
}

const LeadFormRequirements = ({ requirement, onRequirementChange }: LeadFormRequirementsProps) => {
  const requirementFields = [
    { id: "hoardings", label: "Hoardings" },
    { id: "entryGates", label: "Entry Gates" },
    { id: "electricPoles", label: "Electric Poles" },
    { id: "watchTowers", label: "Watch Towers" },
    { id: "chargingPoints", label: "Charging Points" },
    { id: "skyBalloons", label: "Sky Balloons" },
    { id: "ledHoardingSpots", label: "LED Hoarding Spots" },
    { id: "foodStalls", label: "Food Stalls" },
    { id: "changingRooms", label: "Changing Rooms" },
    { id: "activationZoneStalls", label: "Activation Zone Stalls" },
    { id: "trafficBarricades", label: "Traffic Barricades" },
    { id: "droneShow", label: "Drone Show" },
    { id: "webSeries", label: "Web Series" },
    { id: "specialSong", label: "Special Song" }
  ];

  return (
    <div className="space-y-2">
      <Label>Requirements</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {requirementFields.map(field => (
          <div key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type="number"
              value={requirement?.[field.id] || ""}
              onChange={(e) => onRequirementChange(field.id, e.target.value)}
            />
          </div>
        ))}
        <div className="md:col-span-3">
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