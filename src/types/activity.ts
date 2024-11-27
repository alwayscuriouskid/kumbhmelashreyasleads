export type ActivityType = 'call' | 'meeting' | 'email' | 'note' | 'status_change' | 'follow_up';

export interface Activity {
  id: string;
  type: ActivityType;
  date: string;
  created_at: string;  // Changed from optional to required since we're using it for filtering
  notes?: string;
  outcome?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  assignedTo?: string;
  nextAction?: string;
  contactPerson?: string;
  description?: string;
  teamMember?: string;
  leadName?: string;
  activityType?: string;
  activityOutcome?: string;
  activityNextAction?: string;
  activityNextActionDate?: string;
  next_action_date?: string;
  time?: string;
  location?: string;
  callType?: 'incoming' | 'outgoing';
  is_completed?: boolean;
}