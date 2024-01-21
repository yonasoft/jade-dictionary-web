"use client";
import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Paper, Group, Button, Grid } from "@mantine/core";
import { Hanzi } from "react-hanzi-lookup";

type StrokePoint = { x: number; y: number };
type Stroke = StrokePoint[];

type Props = {
  query: string;
  setQuery: (input: string) => void;
};

const ChineseHandwriting = ({ query, setQuery }: Props) => {
  const [characters, setCharacters] = useState<string[]>([]);

  return (
    <>
      <div className="p-4">
        <Grid>
          <Grid.Col span={6}>
            <Hanzi
              handleChange={(x) => {
                setCharacters(x);
              }}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Group align="center" gap="xs">
              {characters.map((character, index) => (
                <Button
                  key={index}
                  variant="outline"
                  color="gray"
                  onClick={() => {
                    setQuery(query + character);
                  }}
                >
                  {character}
                </Button>
              ))}
            </Group>
          </Grid.Col>
        </Grid>
      </div>
    </>
  );
};

export default ChineseHandwriting;
