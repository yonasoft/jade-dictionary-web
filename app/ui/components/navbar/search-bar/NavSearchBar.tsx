import React, { ReactNode, useEffect, useState } from "react";
import {
  ActionIcon,
  HoverCard,
  TextInput,
  Text,
  List,
  useMantineColorScheme,
} from "@mantine/core";
import { spotlight } from "@mantine/spotlight";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";

import SearchSpotlight from "./SearchSpotlight";
import { searchWords } from "@/app/lib/firebase/storage/words";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { Word } from "@/app/lib/definitions";
import { on } from "events";
import { handleKeyPress } from "@/app/lib/utils/events";
import { performSearch } from "@/app/lib/utils/dictionary";

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
  const { colorScheme } = useMantineColorScheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const inputText = isMounted
    ? `text-black ${
        colorScheme === "dark" ? "bg-dark-6 border-none" : "bg-white"
      }`
    : "text-black";

  return (
    <TextInput
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      radius="md"
      placeholder="Search..."
      size="md"
      leftSection={<IconSearch />}
      rightSection={
        <ActionIcon variant="filled" onClick={handleSearch}>
          <IconArrowRight />
        </ActionIcon>
      }
      onKeyDown={handleKeyPress}
      className={`text-black ${inputText}`}
    />
  );
};

const NavSearchBar = () => {
  const { firestore } = useFirebaseContext();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Word[]>([]);
  const [searched, setSearched] = useState(false);

  const onSearch = () => {
    performSearch(firestore, query).then((results) => {
      setResults(results);
    });
  };

  const onInitialSearch = () => {
    onSearch();
    spotlight.open();
  };

  const onKeyPressSearch = (event: React.KeyboardEvent) => {
    handleKeyPress(event, ["Enter", "Go", "Search", "ArrowRight"], () => {
      onInitialSearch();
    });
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
              handleSearch={onInitialSearch}
              handleKeyPress={(e) => {
                onKeyPressSearch(e);
              }}
            />
          </div>
        )}
      </div>
      <SearchSpotlight
        query={query}
        setQuery={setQuery}
        results={results}
        onSearch={onSearch}
        searched={searched}
      />
    </>
  );
};

export default NavSearchBar;
