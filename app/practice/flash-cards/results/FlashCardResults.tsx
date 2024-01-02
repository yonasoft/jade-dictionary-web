import { Word } from "@/app/lib/definitions";
import WordCard from "@/app/ui/components/word-components/word-card/WordCard";
import WordRow from "@/app/ui/components/word-components/word-row/WordRow";
import {
  Accordion,
  AccordionPanel,
  Button,
  Grid,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconX, IconCircle, IconCheck } from "@tabler/icons-react";
import Link from "next/link";

type CategorizedWords = {
  wrong: Word[];
  neutral: Word[];
  correct: Word[];
};

type CategoryToIcon = {
  [key in keyof CategorizedWords]: React.ReactNode;
};

type Props = {
  words: Word[];
  answerCounts: { wrong: number; neutral: number; correct: number };
  allAnswers: string[];
  totalTime: number;
};

const FlashCardResults = ({
  words,
  answerCounts,
  allAnswers,
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

  allAnswers.forEach((answer: string, index: number) => {
    if (answer in categorizedWords) {
      categorizedWords[answer as keyof CategorizedWords].push(words[index]);
    }
  });
  
  const averageTimePerWord = totalTime / words.length;
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="p-4">
      <Title order={2} className="text-center mb-4">
        Flashcard Results
      </Title>

      <Text className="text-center mb-4">Total Time: {totalTime} seconds</Text>
      <Text className="text-center mb-4">
        Average Time per Word: {averageTimePerWord.toFixed(2)} seconds
      </Text>

      <Group justify="center" className="mb-4">
        <Text color="red">
          Wrong: {answerCounts.wrong} <IconX />
        </Text>
        <Text color="yellow">
          Neutral: {answerCounts.neutral} <IconCircle />
        </Text>
        <Text color="green">
          Correct: {answerCounts.correct} <IconCheck />
        </Text>
      </Group>

      <Accordion>
        {Object.entries(categorizedWords).map(([key, wordsList]) => {
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
      <Group justify="center" className="mt-4">
        <Link href="/practice" passHref>
          <Button variant="filled">Return to Practice</Button>
        </Link>
      </Group>
    </div>
  );
};

export default FlashCardResults;
