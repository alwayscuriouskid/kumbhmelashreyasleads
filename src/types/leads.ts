export interface Requirement {
  hoardings?: number;
  entryGates?: number;
  electricPoles?: number;
  watchTowers?: number;
  chargingPoints?: number;
  skyBalloons?: number;
  ledHoardingSpots?: number;
  foodStalls?: number;
  changingRooms?: number;
  activationZoneStalls?: number;
  trafficBarricades?: number;
  droneShow?: number;
  webSeries?: number;
  specialSong?: number;
  customRequirements?: string;
  [key: string]: number | string | undefined;
}

export interface FollowUp {
  id: string;
  date: string;
  notes: string;
  outcome: string;
  nextFollowUpDate?: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'meeting' | 'email' | 'note' | 'status_change';
  date: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  outcome: string;
  notes: string;
  nextAction?: string;
  assignedTo: string;
  contactPerson: string;
  location?: string;
  callType?: 'incoming' | 'outgoing';
  meetingType?: 'in-person' | 'virtual';
  emailType?: 'sent' | 'received';
  statusChange?: {
    from: string;
    to: string;
  };
}

export interface Lead {
  id: string;
  date: string;
  clientName: string;
  location: string;
  contactPerson: string;
  phone: string;
  email: string;
  requirement: Requirement;
  status: string;
  remarks: string;
  nextFollowUp?: string;
  budget?: string;
  followUps: FollowUp[];
  leadRef?: string;
  leadSource?: string;
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
  score?: number;
  priceQuoted?: number;
  nextAction?: string;
  followUpOutcome?: string;
}