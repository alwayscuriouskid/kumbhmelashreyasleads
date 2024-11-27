import { Activity } from "@/types/activity";
import { useState } from "react";
import { startOfDay, isSameDay } from "date-fns";

export const useActivityFilters = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('all');
  const [activityType, setActivityType] = useState<string>('all');
  const [leadSearch, setLeadSearch] = useState<string>('');
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    time: true,
    type: true,
    notes: true,
    teamMember: true,
    leadName: true,
    activityOutcome: true,
    activityNextAction: true,
    activityNextActionDate: true
  });

  const applyFilters = (activities: Activity[]) => {
    console.log('Applying filters:', { selectedTeamMember, activityType, leadSearch, selectedDate });
    
    let filtered = [...activities];

    if (selectedTeamMember !== 'all') {
      filtered = filtered.filter(activity => activity.teamMember === selectedTeamMember);
    }

    if (activityType !== 'all') {
      filtered = filtered.filter(activity => activity.type === activityType);
    }

    if (selectedDate) {
      filtered = filtered.filter(activity => 
        isSameDay(new Date(activity.created_at), selectedDate)
      );
    }

    if (leadSearch.trim()) {
      const searchLower = leadSearch.toLowerCase().trim();
      filtered = filtered.filter(activity => 
        (activity.leadName?.toLowerCase().includes(searchLower)) ||
        (activity.notes?.toLowerCase().includes(searchLower)) ||
        (activity.contactPerson?.toLowerCase().includes(searchLower))
      );
    }

    console.log('Filtered activities:', filtered);
    return filtered;
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedTeamMember,
    setSelectedTeamMember,
    activityType,
    setActivityType,
    leadSearch,
    setLeadSearch,
    visibleColumns,
    setVisibleColumns,
    applyFilters
  };
};