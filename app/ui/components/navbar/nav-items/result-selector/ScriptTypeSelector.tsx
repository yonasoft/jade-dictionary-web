import React from "react";
import {
  Text,
  HoverCard,
  HoverCardDropdown,
  HoverCardTarget,
  SegmentedControl,
  SegmentedControlItem,
  Group,
} from "@mantine/core";
import { ScriptType } from "@/app/lib/definitions";
import classes from "./ScriptTypeSelector.module.css";

type Props = {};

const ScriptTypeSelector = (props: Props) => {
  const data: Array<SegmentedControlItem> = [
    { value: ScriptType.Simplified, label: "Simplified" },
    { value: ScriptType.Traditional, label: "Traditional" },
  ];

  return (
    <Group justify="center">
      <HoverCard width={220} shadow="md">
        <HoverCardTarget>
          <SegmentedControl
            radius="lg"
            size="xs"
            onChange={() => {}}
            data={data}
            defaultValue={data[0].value}
            classNames={classes}
          />
        </HoverCardTarget>
        <HoverCardDropdown>
          <Text size="md" fw={700}>
            Select Script
          </Text>
          <Text size="xs">
            <strong>Simplified Chinese (简体中文)</strong> - Used in Mainland
            China and Singapore. This script simplifies many complex characters.
            <br />
            <strong>Traditional Chinese (繁體中文)</strong> - Used in Taiwan,
            Hong Kong, and Macau. This script preserves the original characters.
          </Text>
        </HoverCardDropdown>
      </HoverCard>
    </Group>
  );
};

export default ScriptTypeSelector;
