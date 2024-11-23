import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

export const setupLeadSubscription = (onUpdate: (payload: any) => void): RealtimeChannel => {
  console.log('Setting up lead subscription');
  return supabase
    .channel('lead-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'leads' },
      (payload) => {
        console.log('Lead change received:', payload);
        onUpdate(payload);
      }
    )
    .subscribe((status) => {
      console.log('Lead subscription status:', status);
    });
};

export const setupActivitySubscription = (onUpdate: (payload: any) => void): RealtimeChannel => {
  console.log('Setting up activity subscription');
  return supabase
    .channel('activity-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'activities' },
      (payload) => {
        console.log('Activity change received:', payload);
        onUpdate(payload);
      }
    )
    .subscribe((status) => {
      console.log('Activity subscription status:', status);
    });
};

export const cleanupSubscription = (channel: RealtimeChannel) => {
  console.log('Cleaning up subscription');
  supabase.removeChannel(channel);
};