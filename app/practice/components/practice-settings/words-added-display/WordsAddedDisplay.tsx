import { Word } from "@/app/lib/types/word";
import WordCard from "@/app/ui/components/word-components/word-card/WordCard";
import WordRow from "@/app/ui/components/word-components/word-row/WordRow";
import { Grid } from "@mantine/core";
import React from "react";

type Props = {
  isMobile: boolean;
  onRemove: (word: Word) => void;
  words: Word[];
};

const WordsAddedDisplay = ({ isMobile, onRemove, words }: Props) => {
  {
    return isMobile ? (
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
    );
  }
};

export default WordsAddedDisplay;
