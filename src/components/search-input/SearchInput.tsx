"use client";
import { ActionIcon, TextInput, useMantineColorScheme } from "@mantine/core";
import { IconSearch, IconArrowRight } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import ChineseInput from "../chinese-input/ChineseInput";

export const SearchInput = ({
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
  const [showKeyboard, setShowKeyboard] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBlur = () => {
    setShowKeyboard(false);
  };

  const handleFocus = () => {
    setShowKeyboard(true);
  };

  return (
    <>
      <TextInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        radius="xl"
        placeholder="Search..."
        size="md"
        leftSection={<IconSearch />}
        rightSection={
          <ActionIcon variant="filled" onClick={handleSearch} radius="lg">
            <IconArrowRight />
          </ActionIcon>
        }
        onKeyDown={handleKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`text-black bg-transparent border-none`}
      />

      {showKeyboard && <ChineseInput query={query} setQuery={setQuery} />}
    </>
  );
};
