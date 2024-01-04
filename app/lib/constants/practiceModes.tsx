import { IconCards, IconListCheck } from "@tabler/icons-react";
import { ReactNode } from "react";

type PracticeMode = {
  title: string;
  description: string;
  icon: ReactNode;
  mode: string;
};

export const practiceModes: PracticeMode[] = [
  {
    title: "Flash Cards",
    description: "Practice with interactive flash cards.",
    icon: <IconCards />,
    mode: "flash-cards",
  },
  {
    title: "Multiple Choice",
    description: "Test your knowledge with multiple choice questions.",
    icon: <IconListCheck />,
    mode: "multiple-choice",
  },
];
