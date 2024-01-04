import { Card, Center, Grid, Text } from "@mantine/core";
import React from "react";

type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  selectedColor?: string;
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
        backgroundColor: selected ? selectedColor || "blue" : "white",
      }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Grid className="h-full" justify="center">
        <Grid.Col span={{ base: 12, sm: 3, lg: 2 }}>
          <Center style={{ height: "100%" }}>{icon}</Center>
        </Grid.Col>
        <Grid.Col className="h-full" span={{ base: 12, sm: 9, lg: 10 }}>
          <Text fw={600}>{title}</Text>
          <Text size="sm">{description}</Text>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default PracticeModeCard;
