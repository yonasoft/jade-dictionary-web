import { CategorizedWords, CategoryToIcon } from "@/app/lib/types/practice";
import { Word } from "@/app/lib/types/word";
import WordCard from "@/app/ui/components/word-components/word-card/WordCard";
import WordRow from "@/app/ui/components/word-components/word-row/WordRow";
import {
  Accordion,
  Button,
  Grid,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconX, IconCircle, IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

type Props = {
  words: Word[];
  rightWrongAnswers: boolean[];
  totalTime: number;
};

const MultipleChoiceResults = ({
  words,
  rightWrongAnswers,
  totalTime,
}: Props) => {
  const categorizedWords: CategorizedWords = {
    wrong: [],
    neutral: [],
    correct: [],
  };

  const categoryToIcon: CategoryToIcon = {
    wrong: <IconX color="red" />,
    neutral: <IconCircle color="yellow" />,
    correct: <IconCheck color="green" />,
  };

  const averageTimePerWord = totalTime / words.length;
  const isMobile = useMediaQuery("(max-width: 768px)");

  rightWrongAnswers.forEach((answer: boolean, index: number) => {
    answer
      ? categorizedWords.correct.push(words[index])
      : categorizedWords.wrong.push(words[index]);
  });

  return (
    <div className="p-4">
      <Title order={2} className="text-center mb-4">
        Flashcard Results
      </Title>

      <Text className="text-center mb-4">Total Time: {totalTime} seconds</Text>
      <Text className="text-center mb-4">
        Average Time per Word: {averageTimePerWord.toFixed(2)} seconds
      </Text>

      <Accordion>
        {Object.entries(categorizedWords).map(([key, wordsList]) => {
          if (key === "neutral") return null;
          const icon = key as keyof CategoryToIcon;

          return (
            <Accordion.Item
              value={`${key.toUpperCase()} (${wordsList.length})`}
              key={key}
            >
              <Accordion.Control icon={categoryToIcon[icon]}>
                {key.toUpperCase()} ({wordsList.length})
              </Accordion.Control>
              <Accordion.Panel>
                {isMobile ? (
                  <Grid className="w-full " gutter={{ base: 2 }}>
                    {wordsList.map((word, index) => (
                      <Grid.Col key={index} span={{ base: 12, xs: 12, md: 12 }}>
                        <WordRow word={word} />
                      </Grid.Col>
                    ))}
                  </Grid>
                ) : (
                  <Grid className="w-full mt-3" gutter={{ base: 4, lg: 8 }}>
                    {wordsList.map((word, index) => (
                      <Grid.Col key={index} span={{ base: 4, xs: 3, md: 2 }}>
                        <WordCard word={word} />
                      </Grid.Col>
                    ))}
                  </Grid>
                )}
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
      <Group justify="center" className="mt-5">
        <Link href="/practice" passHref>
          <Button variant="filled">Return to Practice</Button>
        </Link>
      </Group>
    </div>
  );
};

export default MultipleChoiceResults;
