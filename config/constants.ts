type TuningVariant = {
  title?: string;
  tuning: string[];
};

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
    title: "",
    tuning: ["D", "A", "G", "D", "A", "D"],
  },
];
