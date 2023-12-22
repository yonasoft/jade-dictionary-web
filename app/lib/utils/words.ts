import { Firestore, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { WordList, Word } from "../definitions";
import { searchWords } from "../firebase/storage/words";
  

export const performSearch = async(firestore: Firestore, input: string) => {
	return await searchWords(firestore, input);
};

export const performAddWordToList = async (firestore:Firestore, wordList: WordList, word: Word, ) => {

    const wordListRef = doc(firestore, "wordLists", wordList.id as string);

    await updateDoc(wordListRef, {
        wordIds: arrayUnion(word._id),
        lastUpdatedAt: serverTimestamp(), 
	});
};