"use client";
import React, { useEffect, useState } from "react";
import {
  Text,
  Card,
  Group,
  Button,
  SimpleGrid,
  Title,
  useMantineTheme,
  Grid,
  Chip,
  NativeSelect,
  Switch,
} from "@mantine/core";
import { IconArrowRight, IconCards, IconListCheck } from "@tabler/icons-react";
import PracticeModeCard from "./components/practice-mode-card/PracticeModeCard";
import WordRow from "../ui/components/word-components/word-row/WordRow";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import WordCard from "../ui/components/word-components/word-card/WordCard";
import AddWordToPracticeModal from "../ui/components/modals/add-word-to-practice-modal/AddWordToPracticeModal";
import { on } from "events";
import router from "next/router";
import Link from "next/link";
import { PracticeType, timerOptions } from "../lib/types/practice";
import { Word } from "../lib/types/word";
import { usePracticeSettings } from "../hooks/usePracticeSettings";
import { practiceModes } from "../lib/constants/practiceModes";
import PracticeModeSelector from "./components/practice-mode-selector/PracticeModeSelector";
import WordsAddedDisplay from "./components/words-added-display/WordsAddedDisplay";
import PracticeTypeSelector from "./components/practice-type-selector/PracticeTypeSelector";
import TimerSelection from "./components/timer-selection/TimerSelection";
import StopwatchToggle from "./components/stopwatch-toggle/StopwatchToggle";

const PracticeSettings = () => {
  const {
    wordIds,
    words,
    onRemove,
    onClear,
    addWord,
    addWords,
    handlePracticeTypeChange,
    selectedPracticeTypes,
    selectedMode,
    setSelectedMode,
    timer,
    setTimer,
    stopwatchEnabled,
    setStopwatchEnabled,
    isPracticeTypeSelected,
  } = usePracticeSettings();

  const [opened, { open, close }] = useDisclosure(false);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {}, [words, wordIds]);

  return (
    <div className="p-4 h-full">
      <PracticeModeSelector
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        isMobile={isMobile as boolean}
        wordIds={wordIds}
        isPracticeTypeSelected={isPracticeTypeSelected}
      />

      <Text color="dimmed" size="sm" className="mb-6">
        Please select at least 4 words and choose a practice mode.
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

      <div>
        <Title order={2}>Select Quiz Types</Title>
        {!isPracticeTypeSelected && (
          <Text color="red" size="sm">
            Please select at least one quiz type
          </Text>
        )}

        <PracticeTypeSelector
          selectedPracticeTypes={selectedPracticeTypes}
          handlePracticeTypeChange={handlePracticeTypeChange}
        />
        <TimerSelection timer={timer} setTimer={setTimer} />

        <StopwatchToggle
          stopwatchEnabled={stopwatchEnabled}
          setStopwatchEnabled={setStopwatchEnabled}
        />
      </div>
      <div>
        <Title order={2}>Add Words to Practice</Title>
        <Text color="dimmed" size="sm">
          Choose words to practice from your word lists or search words to add.
        </Text>

        {wordIds.size < 4 && (
          <Text color="red" size="sm">
            Please select at add 4 words
          </Text>
        )}
        <Button className="mt-3" variant="filled" onClick={open}>
          Add
        </Button>
        <Button className="mt-3 ms-3" variant="outline" onClick={onClear}>
          Clear
        </Button>
      </div>
      <div className="mt-3">
        <WordsAddedDisplay
          isMobile={isMobile as boolean}
          onRemove={onRemove}
          words={words}
        />
      </div>

      <AddWordToPracticeModal
        opened={opened}
        close={close}
        addWord={addWord}
        addWords={addWords}
        hasWord={(word: Word) => {
          return wordIds.size > 0 ? wordIds.has(word._id) : false;
        }}
      />
    </div>
  );
};

export default PracticeSettings;
