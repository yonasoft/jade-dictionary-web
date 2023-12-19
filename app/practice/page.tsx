"use client";
import React, { useState } from "react";
import {
  Text,
  Card,
  Group,
  Button,
  SimpleGrid,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconCards, IconListCheck } from "@tabler/icons-react";
import PracticeModeCard from "./practice-mode-card/PracticeModeCard";

const PracticeSelections = () => {
  const [selectedMode, setSelectedMode] = useState("");
  const theme = useMantineTheme();

  const practiceModes = [
    {
      title: "Flash Cards",
      description: "Practice with interactive flash cards.",
      icon: <IconCards />,
      mode: "flashcards",
    },
    {
      title: "Multiple Choice",
      description: "Test your knowledge with multiple choice questions.",
      icon: <IconListCheck />,
      mode: "multipleChoice",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Title order={2}>Select Practice Mode</Title>
        <Button
          variant="filled"
          disabled={selectedMode === ""}
          style={{
            backgroundColor: selectedMode ? theme.colors.jadeGreen[6] : "",
          }}
        >
          Next
        </Button>
      </div>

      <Text color="dimmed" size="sm" className="mb-6">
        Please select at least 4 words and choose a practice type.
      </Text>

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
    </div>
  );
};

export default PracticeSelections;
