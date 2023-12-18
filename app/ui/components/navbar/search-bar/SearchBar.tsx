"use client";
import React, { ReactEventHandler, memo, useState } from "react";

import {
  ActionIcon,
  HoverCard,
  TextInput,
  Text,
  rem,
  List,
} from "@mantine/core";
import {
  Spotlight,
  SpotlightAction,
  SpotlightActionData,
  spotlight,
} from "@mantine/spotlight";
import { IconArrowRight, IconHome, IconSearch } from "@tabler/icons-react";

import classes from "./SearchBar.module.css";
import SearchSpotlight from "./SearchSpotlight";
import { useDictionaryContext } from "@/app/providers/DictionaryProvider";

const SearchInput = ({
  query,
  setQuery,
  handleSearch,
  handleKeyPress,
}: {
  query: string;
  setQuery: (input: string) => void;
  handleSearch: () => void;
  handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
  return (
    <TextInput
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      radius="md"
      placeholder="Search..."
      size="md"
      leftSection={<IconSearch />}
      rightSection={
        <ActionIcon onClick={handleSearch}>
          <IconArrowRight />
        </ActionIcon>
      }
      onKeyDown={(e) => {
        handleKeyPress(e);
      }}
      className="bg-white dark:bg-dark-6 text-black dark:text-white"
    />
  );
};

type Props = {
  openSpotlight: boolean;
  outsideQuery?: string;
  outsideSetQuery?: (query: string) => void;
};

const SearchBar = ({ openSpotlight, outsideQuery, outsideSetQuery }: Props) => {
  const { performSearch } = useDictionaryContext();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    outsideQuery ? performSearch(outsideQuery) : performSearch(query);
    if (openSpotlight === true) {
      spotlight.open();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    const keysToTriggerSearch = ["Enter", "Go", "Search", "ArrowRight"]; // Add other keys as needed
    if (keysToTriggerSearch.includes(event.key)) {
      handleSearch();
    }
  };

  const SearchHoverCard = (searchBar: React.ReactNode): React.ReactNode => {
    return (
      <HoverCard width={280} shadow="md">
        <HoverCard.Target>{searchBar}</HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="md" fw={700}>
            Search Dictionary
          </Text>
          <List type="unordered" listStyleType="disc" size="sm">
            <List.Item>
              <Text size="sm">
                Press&nbsp;
                <strong>Ctrl+K</strong>&nbsp; for quick access
              </Text>
            </List.Item>
            <List.Item>
              <Text size="sm">Example Inputs:</Text>
              <Text size="xs">
                <strong>比如</strong> | <strong>Example</strong> |{" "}
                <strong>bǐ rú</strong> | <strong>bi3 ru2</strong> |{" "}
              </Text>
            </List.Item>
          </List>
        </HoverCard.Dropdown>
      </HoverCard>
    );
  };

  return (
    <>
      <div className="flex-1 max-w-[20rem] w-full">
        {SearchHoverCard(
          <div className="flex w-full max-w-md mx-auto">
            <SearchInput
              query={query}
              setQuery={setQuery}
              handleSearch={handleSearch}
              handleKeyPress={(e) => {
                handleKeyPress(e);
              }}
            />

            <SearchSpotlight query={query} setQuery={setQuery} />
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
