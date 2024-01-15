import { Firestore, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Word } from "../types/word";
import { WordList } from "../types/word-list";


export const performAddWordToList = async (firestore:Firestore, wordList: WordList, word: Word, ) => {

    const wordListRef = doc(firestore, "wordLists", wordList.id as string);

    await updateDoc(wordListRef, {
        wordIds: arrayUnion(word._id),
        lastUpdatedAt: serverTimestamp(), 
	});
};
