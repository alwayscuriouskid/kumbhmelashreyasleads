import { Json } from "@/integrations/supabase/types";

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

export interface Activity {
  id: string;
  type: 'call' | 'meeting' | 'email' | 'note' | 'status_change' | 'follow_up';
  date: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  outcome: string;
  notes: string;
  nextAction?: string;
  next_action_date?: string;
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
  requirement: Json;
  status: string;
  remarks: string | null;
  budget: string | null;
  lead_ref: string | null;
  lead_source: string | null;
  price_quoted: number | null;
  created_at: string | null;
  updated_at: string | null;
  team_member_id?: string | null;
  conversion_status?: string | null;
  conversion_date?: string | null;
  conversion_type?: string | null;
  activity_type?: string | null;
  activity_outcome?: string | null;
  activity_next_action?: string | null;
  activity_next_action_date?: string | null;
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
  budget?: string;
  leadRef?: string;
  leadSource?: string;
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
  score?: number;
  priceQuoted?: number;
  conversion_status?: string;
  conversion_type?: 'order' | 'booking';
  conversion_date?: string;
  activityType?: string;
  activityOutcome?: string;
  activityNextAction?: string;
  activityNextActionDate?: string;
}

export const dbToFrontend = (lead: LeadDB): Lead => ({
  id: lead.id,
  date: lead.date,
  clientName: lead.client_name,
  location: lead.location,
  contactPerson: lead.contact_person,
  phone: lead.phone,
  email: lead.email,
  requirement: lead.requirement as Requirement,
  status: lead.status,
  remarks: lead.remarks || '',
  budget: lead.budget || undefined,
  leadRef: lead.lead_ref || undefined,
  leadSource: lead.lead_source || undefined,
  activities: [],
  createdAt: lead.created_at || new Date().toISOString(),
  updatedAt: lead.updated_at || new Date().toISOString(),
  priceQuoted: lead.price_quoted || undefined,
  activityType: lead.activity_type || undefined,
  activityOutcome: lead.activity_outcome || undefined,
  activityNextAction: lead.activity_next_action || undefined,
  activityNextActionDate: lead.activity_next_action_date || undefined,
  conversion_status: lead.conversion_status,
  conversion_type: lead.conversion_type as 'order' | 'booking' | undefined,
  conversion_date: lead.conversion_date
});

export const frontendToDB = (lead: Partial<Lead>): Omit<LeadDB, 'id'> => {
  // Validate required fields
  if (!lead.clientName || !lead.location || !lead.contactPerson || !lead.phone || !lead.email) {
    throw new Error('Missing required fields: clientName, location, contactPerson, phone, and email are required');
  }

  return {
    client_name: lead.clientName,
    location: lead.location,
    contact_person: lead.contactPerson,
    phone: lead.phone,
    email: lead.email,
    requirement: lead.requirement as Json || {},
    status: lead.status || 'pending',
    remarks: lead.remarks || null,
    budget: lead.budget || null,
    lead_ref: lead.leadRef || null,
    lead_source: lead.leadSource || null,
    price_quoted: lead.priceQuoted || null,
    date: lead.date || new Date().toISOString().split('T')[0],
    created_at: lead.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    team_member_id: null,
    conversion_status: lead.conversion_status || null,
    conversion_date: lead.conversion_date || null,
    conversion_type: lead.conversion_type || null,
    activity_type: lead.activityType || null,
    activity_outcome: lead.activityOutcome || null,
    activity_next_action: lead.activityNextAction || null,
    activity_next_action_date: lead.activityNextActionDate || null
  };
};
