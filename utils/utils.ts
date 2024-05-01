const NOTES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
// 9 is "A" note
const FIRST_NOTE_OFFSET = 9;

const STANDARD_TUNING = [64, 59, 55, 50, 45, 40];

export function noteIdToString(noteId: number): string {
  return NOTES[(noteId - FIRST_NOTE_OFFSET) % NOTES.length];
}

export function stringToNoteId(note: string, stringNo: number): number {
  const closestNumber = STANDARD_TUNING[stringNo];
  for (let i = 0; i < 10; i++) {
    const variant = NOTES.indexOf(note) + FIRST_NOTE_OFFSET + i * 12;
    if (Math.abs(variant - closestNumber) <= 6) {
      return variant;
    }
  }
  return 0;
}

export function getSongExternalUrl(sonsterrSongId: number) {
  return `https://www.songsterr.com/a/wsa/SONG-tab-s${sonsterrSongId}`;
}

export function getSongTuningString(song: any) {
  let tuningString = "";
  for (let index = 6; index > 0; index--) {
    tuningString += noteIdToString(song[`string${index}TuningId`]);
  }
  return tuningString;
}
