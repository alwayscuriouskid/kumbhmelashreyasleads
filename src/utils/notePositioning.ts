interface Position {
  x: number;
  y: number;
}

interface NoteSize {
  width: number;
  height: number;
}

interface NotePosition {
  position?: Position;
  width?: number;
  height?: number;
}

const GRID_GAP = 20;
const DEFAULT_NOTE_WIDTH = 300;
const DEFAULT_NOTE_HEIGHT = 200;

export const calculateNextPosition = (existingNotes: NotePosition[]): Position => {
  if (existingNotes.length === 0) {
    return { x: GRID_GAP, y: GRID_GAP };
  }

  const positions = existingNotes.map(note => ({
    x: note.position?.x || 0,
    y: note.position?.y || 0,
    width: note.width || DEFAULT_NOTE_WIDTH,
    height: note.height || DEFAULT_NOTE_HEIGHT,
  }));

  let row = 0;
  let col = 0;
  let foundPosition = false;
  let newPosition = { x: 0, y: 0 };

  const containerWidth = window.innerWidth - GRID_GAP * 2;
  const maxColumns = Math.floor(containerWidth / (DEFAULT_NOTE_WIDTH + GRID_GAP));

  while (!foundPosition) {
    const testX = col * (DEFAULT_NOTE_WIDTH + GRID_GAP) + GRID_GAP;
    const testY = row * (DEFAULT_NOTE_HEIGHT + GRID_GAP) + GRID_GAP;
    
    // Check if this position overlaps with any existing note
    const hasOverlap = positions.some(pos => {
      return (
        testX < (pos.x + pos.width + GRID_GAP) &&
        (testX + DEFAULT_NOTE_WIDTH + GRID_GAP) > pos.x &&
        testY < (pos.y + pos.height + GRID_GAP) &&
        (testY + DEFAULT_NOTE_HEIGHT + GRID_GAP) > pos.y
      );
    });

    if (!hasOverlap) {
      newPosition = { x: testX, y: testY };
      foundPosition = true;
    } else {
      // Move to next column or row
      col++;
      if (col >= maxColumns) {
        col = 0;
        row++;
      }
    }
  }

  return newPosition;
};

export const DEFAULT_NOTE_SIZE = {
  width: DEFAULT_NOTE_WIDTH,
  height: DEFAULT_NOTE_HEIGHT,
};

export const MINIMUM_NOTE_SIZE = {
  width: 200,
  height: 150,
};