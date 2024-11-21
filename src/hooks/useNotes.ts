import { useState, useEffect } from "react";
import { Note } from "@/types/notes";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Project Ideas",
      content: "Build a new feature for the dashboard that includes analytics and real-time data visualization.",
      category: "Work",
      tags: ["feature", "research"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Team Meeting Notes",
      content: "- Discuss Q2 goals\n- Review project timeline\n- Assign new tasks...",
      category: "Work",
      tags: ["meeting", "followup"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Important Deadlines",
      content: "- Project submission: Next Friday\n- Client presentation: Next Monday\n- Team review: Wednesday",
      category: "Important",
      tags: ["deadline", "urgent"],
      createdAt: new Date().toISOString(),
    },
  ]);

  const categories = ["Work", "Personal", "Important", "Ideas"];
  const tags = ["feature", "research", "meeting", "followup", "deadline", "urgent"];

  return {
    notes,
    setNotes,
    categories,
    tags,
  };
};