import { Card, Group, Text } from "@mantine/core";
import React from "react";

type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  selectedColor?: string; // Add this line
};

const PracticeModeCard = ({
  title,
  description,
  icon,
  selected,
  onClick,
  selectedColor,
}: Props) => {
  return (
    <Card
      shadow="sm"
      p="lg"
      style={{
        backgroundColor: selected ? selectedColor || "blue" : "white", // Use the selectedColor if provided
      }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Group justify="center">
        {icon}
        <div>
          <Text fw={500}>{title}</Text>
          <Text size="sm">{description}</Text>
        </div>
      </Group>
    </Card>
  );
};

export default PracticeModeCard;
