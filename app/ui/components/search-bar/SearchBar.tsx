"use client";

import React from "react";
import { ActionIcon, TextInput, rem } from "@mantine/core";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";

type Props = {};

const SearchBar = (props: Props) => {
  const actions: SpotlightActionData[] = [];

  return (
    <>
      <TextInput
        radius="xl"
        size="md"
        placeholder="Search questions"
        rightSectionWidth={42}
        leftSection={
          <IconSearch
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        }
        rightSection={
          <ActionIcon
            onClick={spotlight.open}
            size="lg"
            radius="xl"
            color="#459D57"
            variant="filled"
            aria-label="Search"
          >
            <IconArrowRight
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
        }
      />
      <Spotlight
        actions={actions}
        nothingFound="Nothing found..."
        highlightQuery
        searchProps={{
          leftSection: (
            <IconSearch
              style={{ width: rem(20), height: rem(20) }}
              stroke={1.5}
            />
          ),
          placeholder: "Search...",
        }}
      />
    </>
  );
};

export default SearchBar;
