import { Note } from "@/types/notes";

export const GRID_GAP = 20;
export const DEFAULT_NOTE_WIDTH = 300;
export const DEFAULT_NOTE_HEIGHT = 200;
export const MINIMUM_NOTE_SIZE = {
  width: 200,
  height: 150,
};

export const calculateGridPosition = (index: number, containerWidth: number) => {
  const columnsPerRow = Math.max(1, Math.floor((containerWidth - GRID_GAP) / (DEFAULT_NOTE_WIDTH + GRID_GAP)));
  const row = Math.floor(index / columnsPerRow);
  const col = index % columnsPerRow;

  return {
    x: col * (DEFAULT_NOTE_WIDTH + GRID_GAP) + GRID_GAP,
    y: row * (DEFAULT_NOTE_HEIGHT + GRID_GAP) + GRID_GAP,
  };
};

export const DEFAULT_NOTE_SIZE = {
  width: DEFAULT_NOTE_WIDTH,
  height: DEFAULT_NOTE_HEIGHT,
};