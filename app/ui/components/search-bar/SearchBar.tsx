"use client";

import React from "react";
import { ActionIcon, TextInput, rem } from "@mantine/core";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { theme } from "@/app/lib/theme";
import classes from "./SearchBar.module.css";

type Props = {};

const SearchBar = (props: Props) => {
  const actions: SpotlightActionData[] = [];

  return (
    <div className="grow">
      <TextInput
        radius="xl"
        size="sm"
        placeholder="Search for a word..."
        rightSectionWidth={42}
        leftSection={
          <IconSearch
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        }
        rightSection={
          <ActionIcon
            className={classes.icon}
            onClick={spotlight.open}
            size="md"
            radius="xl"
            variant="filled"
            aria-label="Search"
          >
            <IconArrowRight
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
              color="white"
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
    </div>
  );
};

export default SearchBar;
