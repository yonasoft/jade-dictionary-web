import { Firestore, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Word, WordList } from "../definitions";

export const performAddWordToList = async (firestore:Firestore, wordList: WordList, word: Word, ) => {

    const wordListRef = doc(firestore, "wordLists", wordList.id as string);

    await updateDoc(wordListRef, {
        wordIds: arrayUnion(word._id),
        lastUpdatedAt: serverTimestamp(), 
	});
};
