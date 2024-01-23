import React from "react";
import { spotlight } from "@mantine/spotlight";

import SearchSpotlight from "./SearchSpotlight";
import { SearchInput } from "../../../search-input/SearchInput";
import useSearch from "@/src/hooks/useSearchBar";
import { SearchHoverCard } from "../../../hover-cards/SearchHoverCard";
import { handleKeyPress } from "@/src/lib/utils/events";

type Props = {
  className?: string;
};

const NavSearchBar = ({ className }: Props) => {
  const { query, setQuery, results, onSearch, searched } = useSearch();

  const onInitialSearch = () => {
    onSearch();
    spotlight.open();
  };

  const onKeyPressSearch = (event: React.KeyboardEvent) => {
    handleKeyPress(event, ["Enter", "Go", "Search", "ArrowRight"], () => {
      onInitialSearch();
    });
  };

  return (
    <>
      <div className={`${className} bg-transparent`}>
        {
          <SearchHoverCard
            searchBar={
              <SearchInput
                query={query}
                setQuery={setQuery}
                handleSearch={onInitialSearch}
                handleKeyPress={(e) => {
                  onKeyPressSearch(e);
                }}
              />
            }
          />
        }
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
