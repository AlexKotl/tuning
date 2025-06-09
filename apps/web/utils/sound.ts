// Legacy, we dont use as its not working on iPhones

import * as Tone from "tone";
import { stringToNoteId } from "./utils";

let sampler: Tone.Sampler;
let isLoaded = false;

export function load(callback: () => void) {
  sampler = new Tone.Sampler({
    urls: {
      C4: "C4.mp3",
      "D#4": "Ds4.mp3",
      "F#4": "Fs4.mp3",
      A4: "A4.mp3",
    },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
    onload: callback,
  }).toDestination();
  isLoaded = true;
}

export function playNote(note: string, stringNo: number): void {
  if (!note) {
    return;
  }
  const noteId = stringToNoteId(note, stringNo);
  let octave = 3;
  if (noteId >= 48) {
    octave = 4;
  }
  if (noteId >= 60) {
    octave = 5;
  }
  
  if (!isLoaded) {
    load(() => sampler.triggerAttackRelease(`${note}${octave}`, 4));
  } else {
    sampler.triggerAttackRelease(`${note}${octave}`, 4);
  }
}

export function playTuning(tuning: string[]) {
  for (let index = 0; index < tuning.length; index++) {
    setTimeout(() => {
      playNote(tuning[index], index);
    }, (6 - index) * 250);
  }
}
