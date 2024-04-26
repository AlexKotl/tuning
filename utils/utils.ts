const NOTES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
// 9 is "A" note
const FIRST_NOTE_OFFSET = 9;

export function noteIdToString(noteId: number): string {
  return NOTES[(noteId - FIRST_NOTE_OFFSET) % NOTES.length];
}

export function stringToNoteId(note: string): number {
  // TODO: implement properly
  return NOTES.indexOf(note);
}
