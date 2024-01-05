"use client";
import React, { useEffect } from "react";
import {
  Text,
  Button,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import AddWordToPracticeModal from "../ui/components/modals/add-word-to-practice-modal/AddWordToPracticeModal";
import Link from "next/link";
import { Word } from "../lib/types/word";
import { usePracticeSettings } from "../hooks/usePracticeSettings";
import PracticeModeSelector from "./components/practice-settings/practice-mode-selector/PracticeModeSelector";
import WordsAddedDisplay from "./components/practice-settings/words-added-display/WordsAddedDisplay";
import PracticeTypeSelector from "./components/practice-settings/practice-type-selector/PracticeTypeSelector";
import TimerSelection from "./components/practice-settings/timer-selection/TimerSelection";
import StopwatchToggle from "./components/practice-settings/stopwatch-toggle/StopwatchToggle";

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
      <div className="flex justify-between items-center mb-4">
        <Title order={2}>Select Practice Mode</Title>
        <Link href={`practice/${selectedMode}`}>
          {isMobile ? (
            <Button
              variant="filled"
              disabled={!isPracticeTypeSelected || wordIds.size < 4}
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                borderRadius: "50%", // Make it circular
                width: "60px",
                height: "60px",
                padding: "0px",
                zIndex: 4000,
              }}
            >
              Start
            </Button>
          ) : (
            <Button
              variant="filled"
              disabled={!isPracticeTypeSelected || wordIds.size < 4}
            >
              Next
            </Button>
          )}
        </Link>
      </div>

      <Text color="dimmed" size="sm" className="mb-6">
        Please select at least 4 words and choose a practice mode.
      </Text>

      <PracticeModeSelector
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        theme={theme}
      />

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
