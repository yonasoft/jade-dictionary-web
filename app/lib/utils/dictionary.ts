import { Firestore } from "firebase/firestore";
import { searchWords } from "../firebase/storage/words";

export const performSearch = async(firestore: Firestore, input: string) => {
	return await searchWords(firestore, input);
};