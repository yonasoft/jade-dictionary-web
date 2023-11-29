"use client";
import { searchSimplified } from "@/app/lib/firebase/words-storage";
import { useDictionaryContext } from "@/app/providers/DictionaryProvider";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { Spotlight, SpotlightAction } from "@mantine/spotlight";
import { setQuery } from "@mantine/spotlight/lib/spotlight.store";
import { IconSearch } from "@tabler/icons-react";
import React from "react";

type Props = {};

const SearchSpotlight = (props: Props) => {
  const dictionary = useDictionaryContext();
  const firebase = useFirebaseContext();

  const results = dictionary.results.map((word) => {
    return (
      <SpotlightAction key={word.id} label={word.definition} highlightQuery></SpotlightAction>
    );
  });

  return (
    <Spotlight.Root
      query={dictionary.query}
      onQueryChange={dictionary.setQuery}
      closeOnClickOutside
      closeOnEscape
      scrollable
    >
      <Spotlight.Search
        placeholder="Search via English, Pinyin, or Chinese..."
        rightSection={
          <IconSearch
            stroke={1.5}
            onClick={() => {
              dictionary.performSearch();
            }}
          />
        }
      />

      <Spotlight.ActionsList>
        {dictionary.results.length > 0 ? (
          results
        ) : (
          <Spotlight.Empty>Nothing found...</Spotlight.Empty>
        )}
      </Spotlight.ActionsList>
    </Spotlight.Root>
  );
};

export default SearchSpotlight;
