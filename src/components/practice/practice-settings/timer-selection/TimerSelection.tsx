import { timerOptions } from "@/src/lib/types/practice";
import { NativeSelect } from "@mantine/core";
import React from "react";

type Props = {
  timer: string;
  setTimer: (timer: string) => void;
};

function TimerSelection({ timer, setTimer }: Props) {
  return (
    <NativeSelect
      className="mb-4"
      style={{ maxWidth: "400px" }} // Set max width using inline style
      data={timerOptions}
      value={timer}
      onChange={(event) => setTimer(event.currentTarget.value)}
      label="Select Timer"
      radius="md"
      size="sm"
      aria-label="Timer Length Select"
    />
  );
}

export default TimerSelection;
