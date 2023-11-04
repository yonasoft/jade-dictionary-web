import React from "react";
import { SegmentedControl, SegmentedControlItem } from "@mantine/core";
import classes from "./Navbar.module.css";
import { ResultType } from "@/app/lib/definitions";

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
