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

export function playNote(noteWithOctave: string) {
  Tone.loaded().then(() => {
    sampler.triggerAttackRelease(noteWithOctave, 4);
  });
}

export function playTuning(tuning: string[]) {
  console.log("playing", tuning);
  for (let index = 0; index < tuning.length; index++) {
    setTimeout(() => {
      const stringNumber = stringToNoteId(tuning[index], index);
      let octave = "3";
      if (stringNumber >= 48) {
        octave = "4";
      }
      if (stringNumber >= 60) {
        octave = "5";
      }
      console.log(
        "stringNumber",
        stringNumber,
        tuning[index],
        "octave",
        octave
      );
      playNote(tuning[index] + octave);
    }, (6 - index) * 250);
  }
}
