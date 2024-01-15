"use client";
import React from "react";
import {
  Text,
  HoverCard,
  HoverCardDropdown,
  HoverCardTarget,
  SegmentedControl,
  Group,
} from "@mantine/core";
import classes from "./ScriptTypeSelector.module.css";
import { ScriptType } from "@/src/lib/types/word";


type Props = {};

const ScriptTypeSelector = (props: Props) => {

  // useEffect(() => {
  //   console.log("ScriptType changed:", dictionaryContext.scriptType);
  // }, [dictionaryContext.scriptType]);

  return (
    <Group justify="center">
      <HoverCard width={220} shadow="md">
        <HoverCardTarget>
          <SegmentedControl
            radius="lg"
            size="xs"
            // value={dictionaryContext.scriptType}
            // onChange={(value) => {
            //   dictionaryContext.setScriptType(value as ScriptType);
            // }}
            data={[ScriptType.Simplified, ScriptType.Traditional]}
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
