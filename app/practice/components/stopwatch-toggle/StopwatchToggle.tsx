import { Switch } from "@mantine/core";
import React from "react";

type Props = {
  stopwatchEnabled: boolean;
  setStopwatchEnabled: (stopwatchEnabled: boolean) => void;
};

const StopwatchToggle = ({ stopwatchEnabled, setStopwatchEnabled }: Props) => {
  return (
    <Switch
      checked={stopwatchEnabled}
      onChange={(event) => setStopwatchEnabled(event.currentTarget.checked)}
      label="Stopwatch"
      className="mb-4"
    />
  );
};

export default StopwatchToggle;
