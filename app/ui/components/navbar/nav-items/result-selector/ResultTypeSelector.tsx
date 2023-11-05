import React from "react";
import { SegmentedControl, SegmentedControlItem } from "@mantine/core";
import { ResultType } from "@/app/lib/definitions";
import classes from "./ResultTypeSelector.module.css";

type Props = {};

const ResultTypeSelector = (props: Props) => {
  const data: Array<SegmentedControlItem> = [
    { value: ResultType.Simplified, label: "Simplified" },
    { value: ResultType.Traditional, label: "Traditional" },
  ];

  return (
    <SegmentedControl
      radius="lg"
      size="xs"
      onChange={() => {}}
      data={data}
      defaultValue={data[0].value}
      classNames={classes}
    />
  );
};

export default ResultTypeSelector;
