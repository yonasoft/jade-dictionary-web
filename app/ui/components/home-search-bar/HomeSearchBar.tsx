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
import { SearchHoverCard } from "../hover-cards/SearchHoverCard";
import { SearchInput } from "../search-input/SearchInput";

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

  return (
    <div className="flex-1 max-w-[20rem] w-full">
      <SearchHoverCard
        searchBar={
          <SearchInput
            query={query}
            setQuery={setQuery}
            handleSearch={onSearch}
            handleKeyPress={onKeyPressSearch}
          />
        }
      />
    </div>
  );
};

export default HomeSearchBar;
