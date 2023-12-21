import React, { memo, useState } from "react";

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

import classes from "./HomeSearchBar.module.css";
import { update } from "firebase/database";
import { Firestore } from "firebase/firestore";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { handleKeyPress } from "@/app/lib/utils/events";

type Props = {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
};

const HomeSearchBar = ({ query, setQuery, onSearch }: Props) => {
  
  const onKeyPressSearch = (event: React.KeyboardEvent) => {
    handleKeyPress(event, ["Enter", "Go", "Search", "ArrowRight"], () => {
      onSearch();
    });
  };

  const SearchInput = (): React.ReactNode => {
    return (
      <TextInput
        value={query}
        onChange={(event) => {
          setQuery(event.currentTarget.value);
        }}
        radius="xl"
        placeholder="Search..."
        rightSectionWidth={42}
        onKeyDown={(event) => {
          onKeyPressSearch(event);
        }}
        leftSection={
          <IconSearch
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        }
        rightSection={
          <ActionIcon
            className={classes.icon}
            onClick={onSearch}
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
    </>
  );
};

export default HomeSearchBar;
