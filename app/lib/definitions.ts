import { FieldValue } from "firebase/firestore";

export enum QueryType {
	English = 'English',
	Hanzi = 'Hanzi',
	Pinyin = 'Pinyin',
}
export enum ScriptType {
	Simplified = 'Simplified',
	Traditional = 'Traditional',
}
export type LinkData = { link: string, label: string, sublinks?: LinkData[], icon?: React.ReactNode };

export type Word = {
	_id: number;
	definition: string;
	pinyin: string;
	simplified: string;
	traditional: string;
};

export type WordList = {
  id?: string; // Optional document ID
  title: string;
  description: string;
  wordIds: number[];
  userUid: string;
  createdAt: FieldValue; // Updated type
  lastUpdatedAt: FieldValue; // Updated type 
};

export enum SortOption {
  Recent = "Recent",
  Oldest = "Oldest",
  Alphabetical = "Alphabetical",
  ReverseAlphabetical = "ReverseAlphabetical",
}

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
