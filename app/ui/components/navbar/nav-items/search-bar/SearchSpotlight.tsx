import { Spotlight, SpotlightAction } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import React from "react";

type Props = {};

const SearchSpotlight = (props: Props) => {
  return (
    <Spotlight.Root
      query={""}
      onSpotlightOpen={() => {}}
      onQueryChange={() => {}}
      closeOnClickOutside
      closeOnEscape
      scrollable
    >
      <Spotlight.Search
        placeholder="Search via English, Pinyin, or Chinese..."
        rightSection={<IconSearch stroke={1.5} />}
        value=""
      />

      <Spotlight.ActionsList>
        <SpotlightAction label="lol" highlightQuery></SpotlightAction>
        <Spotlight.Empty>Nothing found...</Spotlight.Empty>
      </Spotlight.ActionsList>
    </Spotlight.Root>
  );
};

export default SearchSpotlight;
