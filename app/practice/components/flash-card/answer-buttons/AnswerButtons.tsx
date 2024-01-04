import { Group, Button } from "@mantine/core";
import { IconX, IconCircle, IconCheck } from "@tabler/icons-react";
import React from "react";

type Props = {
  handleAnswer: (answer: string) => void;
  isAnswerSelected: (answer: string) => boolean;
  isPaused: boolean;
  timeUp: boolean;
};

const AnswerButtons = ({
  handleAnswer,
  isAnswerSelected,
  isPaused,
  timeUp,
}: Props) => {
  return (
    <Group align="center" mt="md">
      <Button
        variant={isAnswerSelected("wrong") ? "filled" : "default"}
        onClick={() => {
          handleAnswer("wrong");
        }}
        disabled={isPaused}
      >
        <IconX color={isAnswerSelected("wrong") ? "white" : "red"} />
      </Button>
      <Button
        variant={isAnswerSelected("neutral") ? "filled" : "default"}
        onClick={() => {
          handleAnswer("neutral");
        }}
        disabled={timeUp || isPaused}
      >
        <IconCircle color={isAnswerSelected("neutral") ? "white" : "yellow"} />
      </Button>
      <Button
        variant={isAnswerSelected("correct") ? "filled" : "default"}
        onClick={() => {
          handleAnswer("correct");
        }}
        disabled={timeUp || isPaused}
      >
        <IconCheck color={isAnswerSelected("correct") ? "white" : "green"} />
      </Button>
    </Group>
  );
};

export default AnswerButtons;
