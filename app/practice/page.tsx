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
import { PracticeType, Word, WordList } from "../lib/definitions";
import WordCard from "../ui/components/word-components/word-card/WordCard";
import AddWordToPracticeModal from "../ui/components/modals/add-word-to-practice-modal/AddWordToPracticeModal";
import { on } from "events";

const PracticeSelections = () => {
  const [selectedMode, setSelectedMode] = useState("flashcards");
  const [selectedQuizTypes, setSelectedQuizTypes] = useState<PracticeType[]>([
    PracticeType.HanziToDefinition,
  ]);
  const isQuizTypeSelected = selectedQuizTypes.length > 0;

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
      mode: "flashcards",
    },
    {
      title: "Multiple Choice",
      description: "Test your knowledge with multiple choice questions.",
      icon: <IconListCheck />,
      mode: "multipleChoice",
    },
  ];

  const timerOptions = [
    { value: "none", label: "None" },
    { value: "3", label: "3 seconds" },
    { value: "5", label: "5 seconds" },
    { value: "15", label: "15 seconds" },
    { value: "30", label: "30 seconds" },
    { value: "60", label: "1 minute" },
  ];

  useEffect(() => {}, [words, wordIds]);

  useEffect(() => {
    // Load state from localStorage when the component mounts
    const loadedWordIds: Set<number> = new Set(
      JSON.parse(sessionStorage.getItem("practiceWordIds") || "[]")
    );
    const loadedWords = JSON.parse(
      sessionStorage.getItem("practiceWords") || "[]"
    );

    setWordIds(loadedWordIds);
    if (loadedWords.length > 0) {
      setWords(loadedWords);
    }
  }, []);

  useEffect(() => {
    // Save state to localStorage when wordIds or words change
    sessionStorage.setItem(
      "practiceWordIds",
      JSON.stringify(Array.from(wordIds))
    );
    sessionStorage.setItem("practiceWords", JSON.stringify(words));
  }, [wordIds, words]);

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
    if (wordIds.has(word._id)) {
      return;
    } else {
      setWordIds(new Set([...Array.from(wordIds), word._id]));
      setWords([...words, word]);
    }
  };

  const addWords = async (wordsToAdd: Word[]) => {
    const newWordIds = new Set([...Array.from(wordIds)]);
    words.forEach((word) => {
      newWordIds.add(word._id);
    });
    setWordIds(newWordIds);
    setWords([...words, ...wordsToAdd]);
  };

  const handlePracticeTypeChange = (type: PracticeType) => {
    setSelectedQuizTypes((current) =>
      current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type]
    );
  };

  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <Title order={2}>Select Practice Mode</Title>
        {isMobile ? (
          <Button
            variant="filled"
            disabled={!isQuizTypeSelected || wordIds.size < 4}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              borderRadius: "50%", // Make it circular
              width: "60px",
              height: "60px",
              padding: "0px",
            }}
          >
            Start
          </Button>
        ) : (
          <Button variant="filled" disabled={wordIds.size < 4}>
            Next
          </Button>
        )}
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
        {!isQuizTypeSelected && (
          <Text color="red" size="sm">
            Please select at least one quiz type
          </Text>
        )}
        <Group align="center" className="mb-4">
          <Chip
            checked={selectedQuizTypes.includes(PracticeType.HanziToDefinition)}
            onClick={() =>
              handlePracticeTypeChange(PracticeType.HanziToDefinition)
            }
          >
            {"Hanzi <-> Definition"}
          </Chip>
          <Chip
            checked={selectedQuizTypes.includes(PracticeType.HanziToPinyin)}
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
          return wordIds.has(word._id);
        }}
      />
    </div>
  );
};

export default PracticeSelections;
