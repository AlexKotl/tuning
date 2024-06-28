import * as Tone from "tone";
import { stringToNoteId } from "./utils";

let sampler: Tone.Sampler;

export function load() {
  sampler = new Tone.Sampler({
    urls: {
      C4: "C4.mp3",
      "D#4": "Ds4.mp3",
      "F#4": "Fs4.mp3",
      A4: "A4.mp3",
    },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
  }).toDestination();
}

export function playNote(note: string, octave = 4): void {
  if (!note) {
    return;
  }
  sampler.triggerAttackRelease(`${note}${octave}`, 4);
}

export function playTuning(tuning: string[]) {
  for (let index = 0; index < tuning.length; index++) {
    setTimeout(() => {
      const stringNumber = stringToNoteId(tuning[index], index);
      let octave = 3;
      if (stringNumber >= 48) {
        octave = 4;
      }
      if (stringNumber >= 60) {
        octave = 5;
      }
      playNote(tuning[index], octave);
    }, (6 - index) * 250);
  }
}
