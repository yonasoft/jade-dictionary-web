import React from "react";

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

type Props = {
  width?: number;
};

const SearchBar = (props: Props) => {
  const dictionary = useDictionaryContext();

  const onSearch = async () => {
    dictionary.performSearch(dictionary.query);
    spotlight.open();
  };

  const handleEnterKeyPress = (event: React.KeyboardEvent) => {
    const keysToTriggerSearch = ["Enter", "Go", "Search", "ArrowRight"]; // Add other keys as needed
    if (keysToTriggerSearch.includes(event.key)) {
      onSearch();
    }
  };

  const SearchInput = (): React.ReactNode => {
    return (
      <TextInput
        value={dictionary.query}
        onChange={(event) => {
          dictionary.setQuery(event.currentTarget.value);
        }}
        radius="xl"
        placeholder="Search..."
        rightSectionWidth={42}
        onKeyDown={handleEnterKeyPress}
        leftSection={
          <IconSearch
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        }
        rightSection={
          <ActionIcon
            className={classes.icon}
            onClick={async () => {
              onSearch();
            }}
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
    );
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
        {SearchHoverCard(SearchInput())}
      </div>
      <SearchSpotlight />
    </>
  );
};

export default SearchBar;
