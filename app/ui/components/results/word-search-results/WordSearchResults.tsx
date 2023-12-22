import React, { RefAttributes, Suspense, lazy } from "react";
import { Grid, Center, Text, GridProps, StyleProp } from "@mantine/core";
import Loading from "../loading/Loading";
import { Word, WordList } from "@/app/lib/definitions";
import { ColSpan } from "@mantine/core/lib/components/Grid/GridCol/GridCol";
import { Firestore } from "firebase/firestore";

const WordResult = lazy(
  () => import("@/app/ui/components/word-components/word-result/WordResult")
);

type Props = {
  results: Word[];
  query: string;
  onAddToWordList?: (
    firestore: Firestore,
    wordList: WordList,
    word: Word
  ) => Promise<void>;
  onAddToPracticeList?: (word: Word) => Promise<void>;
  isWordUsed?: (word: Word) => boolean;
  searched?: boolean;
  gridSpan?: any;
};

const WordSearchResults = ({
  results,
  query,
  onAddToWordList,
  onAddToPracticeList,
  isWordUsed,
  searched,
  gridSpan,
}: Props) => {
  if (results.length > 0) {
    return (
      <Grid>
        {results.map((word, index) => (
          <Grid.Col key={index} span={gridSpan ? gridSpan : undefined}>
            <Suspense fallback={<Loading />}>
              <WordResult
                word={word}
                query={query}
                onAddToWordList={onAddToWordList}
                onAddToPracticeList={onAddToPracticeList}
                isWordUsed={isWordUsed}
              />
            </Suspense>
          </Grid.Col>
        ))}
      </Grid>
    );
  } else if (searched) {
    return (
      <Center>
        <Text size="xl">Nothing found...</Text>
      </Center>
    );
  }

  return null;
};

export default WordSearchResults;
