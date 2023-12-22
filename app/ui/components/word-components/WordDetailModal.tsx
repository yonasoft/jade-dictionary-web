// WordDetailModal.tsx
import React from "react";
import { Modal, Text } from "@mantine/core";
import { Word } from "@/app/lib/definitions";

type Props = {
  word: Word;
  opened: boolean;
  onClose: () => void;
};

const WordDetailModal = ({ word, opened, onClose }: Props) => {
  return (
    <Modal opened={opened} onClose={onClose} title={word.simplified} centered>
      <Text size="sm">{word.pinyin}</Text>
      <Text fw={600} size="sm">
        {word.simplified} ({word.traditional})
      </Text>
      <Text size="sm">{word.definition}</Text>
    </Modal>
  );
};

export default WordDetailModal;
