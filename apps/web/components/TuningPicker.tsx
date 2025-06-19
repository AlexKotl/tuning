"use client";

import { ChangeEvent } from "react";
import { tuningVariants } from "@tuning/shared";
import StringNote from "./StringNote";

interface TuningPickerProps {
  tuning: string[];
  setTuning: (tuning: string[]) => void;
  onTuningChange: (index: number, value: string) => void;
  isContinuousPlay: boolean;
  setIsContinuousPlay: (value: boolean) => void;
}

export default function TuningPicker({
  tuning,
  setTuning,
  onTuningChange,
  isContinuousPlay,
  setIsContinuousPlay,
}: TuningPickerProps) {

  const handleTuningInputChange =
    (index: number) => (event: ChangeEvent<HTMLSelectElement>) => {
      onTuningChange(index, (event.target as HTMLSelectElement).value);
    };

  function handleQuickPickClick(newTuning: string[]) {
    setTuning(newTuning);
    // Navigate is handled in the parent component
  }

  return (
    <div className="card shadow-xl">
      <div className="card-body p-10">
        <div>
          Quick picks: <br />
          {tuningVariants.map((tuningVariant, index) => (
            <a
              role="button"
              key={index}
              className="btn mx-1 my-1"
              onClick={() => handleQuickPickClick(tuningVariant.tuning)}
            >
              <div className="flex flex-col items-start">
                {tuningVariant.title && (
                  <div className="text-base-content/50 text-xs">
                    {tuningVariant.title}
                  </div>
                )}
                <div>
                  <strong>
                    {[...tuningVariant.tuning].reverse().join("")}
                  </strong>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isContinuousPlay}
              onChange={(e) => setIsContinuousPlay(e.target.checked)}
            />
            <span className="label-text ml-2">Continuous Note Play</span>
          </label>
        </div>

        <div className="my-5 flex gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <StringNote
              key={index}
              index={index}
              tuning={tuning}
              onChange={handleTuningInputChange(5 - index)}
              isContinuousPlay={isContinuousPlay}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 