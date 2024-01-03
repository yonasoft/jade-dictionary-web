import { ActionIcon, TextInput, useMantineColorScheme } from "@mantine/core";
import { IconSearch, IconArrowRight } from "@tabler/icons-react";
import { useState, useEffect } from "react";

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
      className={`text-black ${inputText} bg-transparent border-none`}
    />
  );
};
