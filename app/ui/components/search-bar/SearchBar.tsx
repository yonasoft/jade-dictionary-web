"use client";

import React from "react";

import { ActionIcon, TextInput, rem } from "@mantine/core";
import {
  Spotlight,
  SpotlightAction,
  SpotlightActionData,
  spotlight,
} from "@mantine/spotlight";
import { IconArrowRight, IconHome, IconSearch } from "@tabler/icons-react";

import classes from "./SearchBar.module.css";

type Props = {
  width?: number;
};

const SearchBar = (props: Props) => {
  const actions: SpotlightActionData[] = [];

  return (
    <>
      <TextInput
        className="flex-1 max-w-[20rem] w-full"
        radius="xl"
        placeholder="Search..."
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

      <Spotlight.Root
        query={""}
        onSpotlightOpen={() => {}}
        onQueryChange={() => {}}
        closeOnClickOutside
        closeOnEscape
        scrollable
      >
        <Spotlight.Search
          placeholder="Search..."
          rightSection={<IconSearch stroke={1.5} />}
        />

        <Spotlight.ActionsList>
          <SpotlightAction label="lol" highlightQuery></SpotlightAction>
          <Spotlight.Empty>Nothing found...</Spotlight.Empty>
        </Spotlight.ActionsList>
      </Spotlight.Root>
    </>
  );
};

export default SearchBar;
