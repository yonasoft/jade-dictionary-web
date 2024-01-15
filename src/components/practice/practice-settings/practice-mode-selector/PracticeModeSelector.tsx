
import {
  SimpleGrid,
  MantineTheme,
} from "@mantine/core";
import React from "react";
import PracticeModeCard from "../practice-mode-card/PracticeModeCard";
import { practiceModes } from "@/src/lib/constants/practiceModes";

type Props = {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  theme: MantineTheme;
};

const PracticeModeSelector = ({
  selectedMode,
  setSelectedMode,
  theme,
}: Props) => {
  return (
    <SimpleGrid cols={2} spacing="lg" className="mb-6">
      {practiceModes.map((mode) => (
        <PracticeModeCard
          key={mode.mode}
          title={mode.title}
          description={mode.description}
          icon={mode.icon}
          selected={selectedMode === mode.mode}
          onClick={() => setSelectedMode(mode.mode)}
          selectedColor={theme.colors.jadeGreen[6]}
        />
      ))}
    </SimpleGrid>
  );
};

export default PracticeModeSelector;
