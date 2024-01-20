"use client";
import { ActionIcon, Center, Container } from "@mantine/core";
import { IconWritingSign } from "@tabler/icons-react";
import React, { useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import layout from "simple-keyboard-layouts/build/layouts/chinese";
import { Hanzi } from "react-hanzi-lookup";

type Props = {
  query: string;
  setQuery: (input: string) => void;
};

const ChineseInput = ({ query, setQuery }: Props) => {
  const [showHandwriting, setShowHandwriting] = useState(false);

  return (
    <Container
      size="lg"
      className="fixed bottom-0 left-0 right-0 z-50"
      tabIndex={0}
    >
      {/* <Center className="flex flex-col">
        <ActionIcon
          className="my-2"
          variant="outline"
          size="lg"
          onClick={(e) => {
            e.preventDefault();
            setShowHandwriting(!showHandwriting);
          }}
        >
          <IconWritingSign />
        </ActionIcon>
      </Center> */}
      <Keyboard
        className="min-w-full"
        onChange={(button) => {
          setQuery(button);
        }} // Use handleOnChange from the context
        onKeyPress={(button) => {
          console.log("Button pressed", button);
        }}
        input={query} // Use query from the context
        preventMouseDownDefault
        {...layout}
      />
    </Container>
  );
};

export default ChineseInput;
