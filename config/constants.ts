type TuningVariant = {
  title?: string;
  tuning: string[];
};

export const notesVariants = [
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
];

export const tuningVariants: TuningVariant[] = [
  {
    title: "Standard",
    tuning: ["E", "B", "G", "D", "A", "E"],
  },
  {
    title: "Drop D",
    tuning: ["D", "A", "F#", "D", "A", "D"],
  },
  {
    title: "Celtic",
    tuning: ["D", "A", "G", "D", "A", "D"],
  },
  {
    title: "Open C Tuning",
    tuning: ["D", "B", "G", "D", "G", "D"],
  },
  {
    title: "Open G Tuning",
    tuning: ["E", "C", "G", "C", "G", "C"],
  },
  {
    title: "Double Drop D Tuning",
    tuning: ["D", "A", "D", "G", "B", "D"],
  },
];
