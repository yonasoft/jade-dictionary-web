import { Auth } from "firebase/auth";
import { WordList } from "../definitions";
import { Firestore, addDoc, collection } from "firebase/firestore";

const createWordList = async (userUid:string, db: Firestore, title: string, description: string): Promise<void> => {
  try {

    const newWordList: WordList = {
      title: title,
      description: description,
      wordIds: [], // Initially empty, can be updated later with word IDs
      userUid: userUid
    };

    // Add the new word list to Firestore
    await addDoc(collection(db, "wordLists"), newWordList);

    console.log("Word list created successfully");
  } catch (error) {
    console.error("Error creating word list: ", error);
  }
};