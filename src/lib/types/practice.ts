import { Word } from "./word";

export enum PracticeType {
  HanziToDefinition = 'Hanzi <-> Definition',
  HanziToPinyin = 'Hanzi <-> Pinyin',
}



export const timerOptions = [
  { value: "none", label: "None" },
  { value: "3", label: "3 seconds" },
  { value: "5", label: "5 seconds" },
  { value: "10", label: "10 seconds" },
  { value: "15", label: "15 seconds" },
  { value: "30", label: "30 seconds" },
  { value: "60", label: "1 minute" },
];

export type CategorizedWords = {
  wrong: Word[];
  neutral: Word[];
  correct: Word[];
};

export type CategoryToIcon = {
  [key in keyof CategorizedWords]: React.ReactNode;
};

