"use client";
import {
  ActionIcon,
  Container,
  Flex,
  Group,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconSearch,
  IconArrowRight,
  IconKeyboard,
  IconWriting,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import layout from "simple-keyboard-layouts/build/layouts/chinese";

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
  const [showKeyboard, setShowKeyboard] = useState(false); // Add this line

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const inputText = isMounted
    ? `text-black ${
        colorScheme === "dark" ? "bg-dark-6 border-none" : "bg-white"
      }`
    : "text-black";

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
        onFocus={() => {
          setShowKeyboard(true);
        }}
        onBlur={() => {
          setShowKeyboard(false);
        }}
        className={`text-black bg-transparent border-none`}
      />
      {showKeyboard && (
        <Container size="lg" className="fixed bottom-0 left-0 right-0 z-50">
          <Keyboard
            className="min-w-full"
            onChange={(button) => {
              setQuery(button);
            }} // Use handleOnChange from the context
            onKeyPress={(button) => {
              setQuery(query + button);
            }}
            input={query} // Use query from the context
            preventMouseDownDefault
            {...layout}
          />
        </Container>
      )}
    </>
  );
};
