import { Title, Button } from "@mantine/core";
import Link from "next/link";
import React from "react";

type Props = {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  isMobile: boolean;
  wordIds: Set<number>;
  isPracticeTypeSelected: boolean;
};

const PracticeModeSelector = ({
  selectedMode,
  setSelectedMode,
  isMobile,
  wordIds,
  isPracticeTypeSelected,
}: Props) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Title order={2}>Select Practice Mode</Title>
      <Link href={`practice/${selectedMode}`}>
        {isMobile ? (
          <Button
            variant="filled"
            disabled={!isPracticeTypeSelected || wordIds.size < 4}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              borderRadius: "50%", // Make it circular
              width: "60px",
              height: "60px",
              padding: "0px",
              zIndex: 4000,
            }}
          >
            Start
          </Button>
        ) : (
          <Button
            variant="filled"
            disabled={!isPracticeTypeSelected || wordIds.size < 4}
          >
            Next
          </Button>
        )}
      </Link>
    </div>
  );
};

export default PracticeModeSelector;
