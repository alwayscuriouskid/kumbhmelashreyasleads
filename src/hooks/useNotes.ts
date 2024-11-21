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
      position: { x: 100, y: 100 },
    },
    {
      id: "2",
      title: "Team Meeting Notes",
      content: "- Discuss Q2 goals\n- Review project timeline\n- Assign new tasks...",
      category: "Work",
      tags: ["meeting", "followup"],
      createdAt: new Date().toISOString(),
      position: { x: 450, y: 100 },
    },
    {
      id: "3",
      title: "Important Deadlines",
      content: "- Project submission: Next Friday\n- Client presentation: Next Monday\n- Team review: Wednesday",
      category: "Important",
      tags: ["deadline", "urgent"],
      createdAt: new Date().toISOString(),
      position: { x: 800, y: 100 },
    },
  ]);

  const [categories, setCategories] = useState<string[]>(["Work", "Personal", "Important", "Ideas"]);
  const [tags, setTags] = useState<string[]>(["feature", "research", "meeting", "followup", "deadline", "urgent"]);

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
      console.log("Added new category:", category);
    }
  };

  useEffect(() => {
    console.log("Categories updated:", categories);
  }, [categories]);

  return {
    notes,
    setNotes,
    categories,
    tags,
    addCategory,
  };
};