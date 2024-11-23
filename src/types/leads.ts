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
  requirement: unknown; // Changed from Requirement to unknown for safe type casting
  status: string;
  remarks: string | null;
  next_follow_up: string | null;
  budget: string | null;
  lead_ref: string | null;
  lead_source: string | null;
  price_quoted: number | null;
  next_action: string | null;
  follow_up_outcome: string | null;
  created_at: string | null;
  updated_at: string | null;
  team_member_id?: string | null;
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
  requirement: (lead.requirement as Requirement) || {},
  status: lead.status,
  remarks: lead.remarks || '',
  nextFollowUp: lead.next_follow_up || undefined,
  budget: lead.budget || undefined,
  followUps: [],
  leadRef: lead.lead_ref || undefined,
  leadSource: lead.lead_source || undefined,
  activities: [],
  createdAt: lead.created_at || new Date().toISOString(),
  updatedAt: lead.updated_at || new Date().toISOString(),
  priceQuoted: lead.price_quoted || undefined,
  nextAction: lead.next_action || undefined,
  followUpOutcome: lead.follow_up_outcome || undefined
});

export const frontendToDB = (lead: Partial<Lead>): Omit<LeadDB, 'requirement'> & { requirement: Requirement } => {
  // Validate required fields
  if (!lead.clientName || !lead.location || !lead.contactPerson || !lead.phone || !lead.email) {
    throw new Error('Missing required fields: clientName, location, contactPerson, phone, and email are required');
  }

  return {
    id: lead.id!,
    client_name: lead.clientName,
    location: lead.location,
    contact_person: lead.contactPerson,
    phone: lead.phone,
    email: lead.email,
    requirement: lead.requirement || {},
    status: lead.status || 'pending',
    remarks: lead.remarks || null,
    next_follow_up: lead.nextFollowUp || null,
    budget: lead.budget || null,
    lead_ref: lead.leadRef || null,
    lead_source: lead.leadSource || null,
    price_quoted: lead.priceQuoted || null,
    next_action: lead.nextAction || null,
    follow_up_outcome: lead.followUpOutcome || null,
    date: lead.date || new Date().toISOString().split('T')[0],
    created_at: lead.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};
