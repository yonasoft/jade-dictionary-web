"use client";
import { ActionIcon, Center, Container } from "@mantine/core";
import { IconWritingSign, IconX } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import layout from "simple-keyboard-layouts/build/layouts/chinese";
import { Hanzi } from "react-hanzi-lookup";
import ChineseHandwriting from "../chinese-handwriting/ChineseHandwriting";

type Props = {
  query: string;
  setQuery: (input: string) => void;
  onClose: () => void;
};

const ChineseInput = ({ query, setQuery, onClose }: Props) => {
  const [showHandwriting, setShowHandwriting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowHandwriting(false);
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault(); // Prevent the default behavior
    event.stopPropagation(); // Stop the event from bubbling up
  };

  return (
    <Container
      size="lg"
      className="fixed bottom-0 left-0 right-0 z-50"
      tabIndex={0}
      ref={containerRef}
      onMouseDown={handleMouseDown}
    >
      {showHandwriting && (
        <ChineseHandwriting query={query} setQuery={setQuery} />
      )}
      <Center>

        <ActionIcon
          className="m-2"
          variant="filled"
          size="xl"
          radius="xl"
          onClick={() => {
            onClose();
          }}
        >
          <IconX />
        </ActionIcon>
      </Center>
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
