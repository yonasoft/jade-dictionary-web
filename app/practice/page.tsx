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
import { PracticeType, Word, WordList, timerOptions } from "../lib/definitions";
import WordCard from "../ui/components/word-components/word-card/WordCard";
import AddWordToPracticeModal from "../ui/components/modals/add-word-to-practice-modal/AddWordToPracticeModal";
import { on } from "events";
import router from "next/router";
import Link from "next/link";

const PracticeSelections = () => {
  const [selectedMode, setSelectedMode] = useState("flash-cards");

  const [selectedPracticeTypes, setSelectedPracticeTypes] = useState<
    PracticeType[]
  >([]);
  const isPracticeTypeSelected = selectedPracticeTypes.length > 0;

  const [timer, setTimer] = useState("none");
  const [stopwatchEnabled, setStopwatchEnabled] = useState(false);

  const [wordIds, setWordIds] = useState<Set<number>>(new Set([]));
  const [words, setWords] = useState<Word[]>([]);

  const [opened, { open, close }] = useDisclosure(false);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  

  const practiceModes = [
    {
      title: "Flash Cards",
      description: "Practice with interactive flash cards.",
      icon: <IconCards />,
      mode: "flash-cards",
    },
    {
      title: "Multiple Choice",
      description: "Test your knowledge with multiple choice questions.",
      icon: <IconListCheck />,
      mode: "multiple-choice",
    },
  ];


  useEffect(() => {
    console.log("wordids", wordIds, "words", words);
  }, [words, wordIds]);

  useEffect(() => {
    const savedPracticeMode = JSON.parse(
      sessionStorage.getItem("practiceMode") || '"flash-cards"'
    );
    const savedPracticeTypes = JSON.parse(
      sessionStorage.getItem("practiceTypes") || "[]"
    );
    const savedTimer = JSON.parse(
      sessionStorage.getItem("practiceTimer") || '"none"'
    );
    const savedStopwatchEnabled = JSON.parse(
      sessionStorage.getItem("practiceStopwatch") || "false"
    );
    const savedWordIds = new Set<number>(
      JSON.parse(sessionStorage.getItem("practiceWordIds") || "[]")
    );
    const savedWords = JSON.parse(
      sessionStorage.getItem("practiceWords") || "[]"
    );

    if (savedPracticeMode !== selectedMode) setSelectedMode(savedPracticeMode);

    if (savedWordIds.size > 0) {
      setWordIds(savedWordIds);
    }
    if (savedWords.length > 0) {
      setWords(savedWords);
    }

    if (savedPracticeTypes.length > 0) {
      setSelectedPracticeTypes(savedPracticeTypes);
    }

    if (savedTimer !== "none") setTimer(savedTimer);

    if (stopwatchEnabled !== savedStopwatchEnabled)
      setStopwatchEnabled(savedStopwatchEnabled);
  }, []);

  useEffect(() => {
    console.log("Saving words to session storage");
    sessionStorage.setItem("practiceMode", JSON.stringify(selectedMode));
  }, [selectedMode]);

  useEffect(() => {
    console.log("Saving selectedQuizTypes to session storage");
    sessionStorage.setItem(
      "practiceTypes",
      JSON.stringify(selectedPracticeTypes)
    );
  }, [selectedPracticeTypes]);

  useEffect(() => {
    console.log("Saving timer to session storage");
    sessionStorage.setItem("practiceTimer", JSON.stringify(timer));
  }, [timer]);

  useEffect(() => {
    console.log("Saving stopwatchEnabled to session storage");
    sessionStorage.setItem(
      "practiceStopwatch",
      JSON.stringify(stopwatchEnabled)
    );
  }, [stopwatchEnabled]);

  useEffect(() => {
    console.log("Saving wordIds to session storage");
    sessionStorage.setItem(
      "practiceWordIds",
      JSON.stringify(Array.from(wordIds))
    );
  }, [wordIds]);

  useEffect(() => {
    console.log("Saving words to session storage");
    sessionStorage.setItem("practiceWords", JSON.stringify(words));
  }, [words]);

  

  const onRemove = (word: Word) => {
    const newWordIds = new Set(wordIds);
    newWordIds.delete(word._id);
    setWordIds(newWordIds);
    setWords(words.filter((w) => w._id !== word._id));
  };

  const onClear = async () => {
    setWordIds(new Set([]));
    setWords([]);
  };

  const addWord = async (word: Word) => {
    if (wordIds.size > 0 && wordIds.has(word._id)) {
      return;
    } else {
      setWordIds(new Set([...Array.from(wordIds), word._id]));
      setWords([...words, word]);
    }
  };

  const addWords = async (wordsToAdd: Word[]) => {
    const newWordIds = new Set(wordIds);

    wordsToAdd.forEach((word) => {
      if (newWordIds.size === 0 || !newWordIds.has(word._id)) {
        newWordIds.add(word._id);
      }
    });

    setWordIds(newWordIds);
    setWords([
      ...words,
      ...wordsToAdd.filter((word) => !wordIds.has(word._id)),
    ]);
  };

  const handlePracticeTypeChange = (type: PracticeType) => {
    setSelectedPracticeTypes((current) =>
      current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type]
    );
  };

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

export default PracticeSelections;
