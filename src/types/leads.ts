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
  assignedTo?: string;
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
  time?: string;
  description?: string;
  teamMember?: string;
  leadName?: string;
  nextFollowUp?: string;
  followUpOutcome?: string;
  activityOutcome?: string;
}

export interface LeadDB {
  id: string;
  date: string;
  client_name: string;
  location: string;
  contact_person: string;
  phone: string;
  email: string;
  requirement: Requirement;
  status: string;
  remarks: string | null;
  next_follow_up: string | null;
  budget: string | null;
  lead_ref: string | null;
  lead_source: string | null;
  price_quoted: number | null;
  next_action: string | null;
  follow_up_outcome: string | null;
  created_at: string;
  updated_at: string;
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

export const dbToFrontend = (lead: LeadDB): Lead => ({
  id: lead.id,
  date: lead.date,
  clientName: lead.client_name,
  location: lead.location,
  contactPerson: lead.contact_person,
  phone: lead.phone,
  email: lead.email,
  requirement: lead.requirement,
  status: lead.status,
  remarks: lead.remarks || '',
  nextFollowUp: lead.next_follow_up || undefined,
  budget: lead.budget || undefined,
  followUps: [], // These will be populated separately if needed
  leadRef: lead.lead_ref || undefined,
  leadSource: lead.lead_source || undefined,
  activities: [], // These will be populated separately if needed
  createdAt: lead.created_at,
  updatedAt: lead.updated_at,
  priceQuoted: lead.price_quoted || undefined,
  nextAction: lead.next_action || undefined,
  followUpOutcome: lead.follow_up_outcome || undefined
});

export const frontendToDB = (lead: Partial<Lead>): Partial<LeadDB> => ({
  client_name: lead.clientName,
  location: lead.location,
  contact_person: lead.contactPerson,
  phone: lead.phone,
  email: lead.email,
  requirement: lead.requirement,
  status: lead.status,
  remarks: lead.remarks,
  next_follow_up: lead.nextFollowUp,
  budget: lead.budget,
  lead_ref: lead.leadRef,
  lead_source: lead.leadSource,
  price_quoted: lead.priceQuoted,
  next_action: lead.nextAction,
  follow_up_outcome: lead.followUpOutcome,
  date: lead.date
});