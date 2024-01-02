import { FieldValue } from "firebase/firestore";

export type WordList = {
  id?: string; // Optional document ID
  title: string;
  description: string;
  wordIds: number[];
  userUid: string;
  createdAt: FieldValue; // Updated type
  lastUpdatedAt: FieldValue; // Updated type 
};