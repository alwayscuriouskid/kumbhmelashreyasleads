export interface Requirement {
  [key: string]: string | number | null;
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
  remarks?: string;
  budget?: string;
  leadRef?: string;
  leadSource?: string;
  priceQuoted?: number;
  teamMemberId?: string;
  conversionStatus?: string;
  conversionDate?: string;
  conversionType?: string;
  activityType?: string;
  activityOutcome?: string;
  activityNextAction?: string;
  activityNextActionDate?: string;
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
  remarks?: string;
  budget?: string;
  lead_ref?: string;
  lead_source?: string;
  price_quoted?: number;
  team_member_id?: string;
  conversion_status?: string;
  conversion_date?: string;
  conversion_type?: string;
  activity_type?: string;
  activity_outcome?: string;
  activity_next_action?: string;
  activity_next_action_date?: string;
  created_at?: string;
  updated_at?: string;
}

export const dbToFrontend = (dbLead: LeadDB): Lead => ({
  id: dbLead.id,
  date: dbLead.date,
  clientName: dbLead.client_name,
  location: dbLead.location,
  contactPerson: dbLead.contact_person,
  phone: dbLead.phone,
  email: dbLead.email,
  requirement: dbLead.requirement,
  status: dbLead.status,
  remarks: dbLead.remarks,
  budget: dbLead.budget,
  leadRef: dbLead.lead_ref,
  leadSource: dbLead.lead_source,
  priceQuoted: dbLead.price_quoted,
  teamMemberId: dbLead.team_member_id,
  conversionStatus: dbLead.conversion_status,
  conversionDate: dbLead.conversion_date,
  conversionType: dbLead.conversion_type,
  activityType: dbLead.activity_type,
  activityOutcome: dbLead.activity_outcome,
  activityNextAction: dbLead.activity_next_action,
  activityNextActionDate: dbLead.activity_next_action_date
});

export const frontendToDB = (lead: Partial<Lead>): Partial<LeadDB> => ({
  id: lead.id,
  date: lead.date,
  client_name: lead.clientName,
  location: lead.location,
  contact_person: lead.contactPerson,
  phone: lead.phone,
  email: lead.email,
  requirement: lead.requirement,
  status: lead.status,
  remarks: lead.remarks,
  budget: lead.budget,
  lead_ref: lead.leadRef,
  lead_source: lead.leadSource,
  price_quoted: lead.priceQuoted,
  team_member_id: lead.teamMemberId,
  conversion_status: lead.conversionStatus,
  conversion_date: lead.conversionDate,
  conversion_type: lead.conversionType,
  activity_type: lead.activityType,
  activity_outcome: lead.activityOutcome,
  activity_next_action: lead.activityNextAction,
  activity_next_action_date: lead.activityNextActionDate
});

export type Activity = {
  id: string;
  type: 'call' | 'meeting' | 'email' | 'note' | 'status_change' | 'follow_up';
  date: string;
  time?: string;
  notes?: string;
  outcome?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  assignedTo?: string;
  nextAction?: string;
  next_action_date?: string;
  contactPerson?: string;
  location?: string;
  callType?: 'incoming' | 'outgoing';
  description?: string;
  teamMember?: string;
  leadName?: string;
  activityType?: string;
  activityOutcome?: string;
  activityNextAction?: string;
  activityNextActionDate?: string;
  update?: string;
  is_completed?: boolean;
};