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
export interface FirestoreUserData {
	uid: string;
	email: string | null;
	displayName: string | null;
	photoURL: string | null;
	photoFileName: string | null;
	emailVerified: boolean | null;
}

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