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
import PracticeModeCard from "./practice-mode-card/PracticeModeCard";
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
        <Group align="center" className="mb-4">
          <Chip
            checked={selectedPracticeTypes.includes(
              PracticeType.HanziToDefinition
            )}
            onClick={() =>
              handlePracticeTypeChange(PracticeType.HanziToDefinition)
            }
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

        <NativeSelect
          className="mb-4"
          style={{ maxWidth: "400px" }} // Set max width using inline style
          data={timerOptions}
          value={timer}
          onChange={(event) => setTimer(event.currentTarget.value)}
          label="Select Timer"
          radius="md"
          size="sm"
          aria-label="Timer Length Select"
        />

        <Switch
          checked={stopwatchEnabled}
          onChange={(event) => setStopwatchEnabled(event.currentTarget.checked)}
          label="Stopwatch"
          className="mb-4"
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
        {isMobile ? (
          <Grid className="w-full " gutter={{ base: 2 }}>
            {words.map((word, index) => (
              <Grid.Col key={index} span={{ base: 12, xs: 12, md: 12 }}>
                <WordRow
                  word={word}
                  onWordRemove={() => {
                    onRemove(word);
                  }}
                />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Grid className="w-full mt-3" gutter={{ base: 4, lg: 8 }}>
            {words.map((word, index) => (
              <Grid.Col key={index} span={{ base: 4, xs: 3, md: 2 }}>
                <WordCard
                  word={word}
                  onWordRemove={() => {
                    onRemove(word);
                  }}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}
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
