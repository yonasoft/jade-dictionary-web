import React, { Suspense, lazy } from "react";
import { Grid, Center, Text } from "@mantine/core";
import Loading from "../loading/Loading";
import { Firestore } from "firebase/firestore";
import { Word } from "@/src/lib/types/word";
import { WordList } from "@/src/lib/types/word-list";
const WordResult = lazy(
  () => import("../../word-components/word-result/WordResult")
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
