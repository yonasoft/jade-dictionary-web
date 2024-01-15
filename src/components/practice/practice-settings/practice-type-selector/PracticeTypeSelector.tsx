import { PracticeType } from "@/src/lib/types/practice";
import { Group, Chip } from "@mantine/core";
import React from "react";

type Props = {
  selectedPracticeTypes: PracticeType[];
  handlePracticeTypeChange: (practiceType: PracticeType) => void;
};

const PracticeTypeSelector = ({
  selectedPracticeTypes,
  handlePracticeTypeChange,
}: Props) => {
  return (
    <Group align="center" className="mb-4">
      <Chip
        checked={selectedPracticeTypes.includes(PracticeType.HanziToDefinition)}
        onClick={() => handlePracticeTypeChange(PracticeType.HanziToDefinition)}
      >
        {"Hanzi <-> Definition"}
      </Chip>
      <Chip
        checked={selectedPracticeTypes.includes(PracticeType.HanziToPinyin)}
        onClick={() => handlePracticeTypeChange(PracticeType.HanziToPinyin)}
      >
        {"Hanzi <-> Pinyin"}
      </Chip>
    </Group>
  );
};

export default PracticeTypeSelector;
