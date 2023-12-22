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
} from "@mantine/core";
import { IconCards, IconListCheck } from "@tabler/icons-react";
import PracticeModeCard from "./practice-mode-card/PracticeModeCard";
import WordRow from "../ui/components/word-components/word-row/WordRow";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Word } from "../lib/definitions";
import WordCard from "../ui/components/word-components/word-card/WordCard";
import AddWordToPracticeModal from "../ui/components/modals/add-word-to-practice-modal/AddWordToPracticeModal";

const PracticeSelections = () => {
  const [selectedMode, setSelectedMode] = useState("flashcards"); // Set default to 'flashcards'
  const [wordIds, setWordIds] = useState<number[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {}, [words, wordIds]);
  // Adjust breakpoint as needed

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

        <Button variant="filled" disabled={wordIds.length < 4}>
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

      <div>
        <Title order={2}>Add Words to Practice</Title>
        <Text color="dimmed" size="sm">
          Choose words to practice from your word lists or search words to add.
        </Text>
      </div>
      <div>
        {wordIds.length < 4 && (
          <Text color="red" size="sm">
            Please select at add 4 words
          </Text>
        )}
        <Button className="mt-3" variant="filled" onClick={open}>
          Add
        </Button>

        {isMobile ? (
          <Grid className="w-full">
            {words.map((word, index) => (
              <Grid.Col key={index} span={{ base: 12, xs: 12, md: 12 }}>
                <WordRow word={word} onWordRemove={() => {}} />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Grid className="w-full" gutter={{ base: 4, lg: 8 }}>
            {words.map((word, index) => (
              <Grid.Col key={index} span={{ base: 4, xs: 3, md: 2 }}>
                <WordCard word={word} onWordRemove={() => {}} />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </div>
      <AddWordToPracticeModal
        opened={opened}
        close={close}
        words={words}
        addWord={(word: Word) => {
          setWords([word, ...words]);
        }}
        wordIds={wordIds}
        addWordIds={(wordId: number) => {
          setWordIds([wordId, ...wordIds]);
        }}
      />
    </div>
  );
};

export default PracticeSelections;
