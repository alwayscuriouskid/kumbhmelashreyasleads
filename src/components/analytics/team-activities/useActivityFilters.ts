import { Activity } from "@/types/leads";
import { useState, useEffect } from "react";

export const useActivityFilters = (activities: Activity[]) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('all');
  const [activityType, setActivityType] = useState<string>('all');
  const [leadSearch, setLeadSearch] = useState<string>('');
  const [visibleColumns, setVisibleColumns] = useState({
    time: true,
    type: true,
    description: true,
    teamMember: true,
    leadName: true,
    statusChange: true,
    nextFollowUp: true,
    followUpOutcome: true,
    nextAction: true,
    activityOutcome: true
  });

  const applyFilters = (activities: Activity[]) => {
    console.log('Applying filters:', { selectedTeamMember, activityType, leadSearch, selectedDate });
    
    let filtered = [...activities];

    // Filter by team member
    if (selectedTeamMember !== 'all') {
      filtered = filtered.filter(activity => activity.teamMember === selectedTeamMember);
    }

    // Filter by activity type
    if (activityType !== 'all') {
      filtered = filtered.filter(activity => activity.type === activityType);
    }

    // Filter by date
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      filtered = filtered.filter(activity => 
        activity.date.toString().includes(dateStr)
      );
    }

    // Search by lead name, description, or contact person
    if (leadSearch.trim()) {
      const searchLower = leadSearch.toLowerCase().trim();
      filtered = filtered.filter(activity => 
        (activity.leadName?.toLowerCase().includes(searchLower)) ||
        (activity.description?.toLowerCase().includes(searchLower)) ||
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