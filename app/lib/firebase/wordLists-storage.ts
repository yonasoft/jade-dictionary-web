
import { WordList } from "../definitions";
import { DocumentReference, DocumentSnapshot, Firestore, addDoc, arrayRemove, arrayUnion, collection, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

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


const addWordToWordList = async (db: Firestore, wordListRef: DocumentReference, wordId: number): Promise<void> => {
  try {
    // Get the word list document
    const wordListSnapshot = await getDoc(wordListRef);

    if (!wordListSnapshot.exists()) {
      throw new Error("Word list not found");
    }

    // Check if the wordId already exists in the wordIds array
    const wordListData = wordListSnapshot.data() as WordList;
    if (wordListData.wordIds.includes(wordId)) {
      throw new Error("Word already exists in the word list");
    }

    // Update the wordIds array in Firestore to add the new wordId
    await updateDoc(wordListRef, {
      wordIds: arrayUnion(wordId)
    });

    console.log("Word added to the word list successfully");
  } catch (error) {
    console.error("Error adding word to word list: ", error);
    throw error; // Re-throw the error to handle it in the front end
  }
};


const removeWordFromWordList = async (db: Firestore, wordListRef: DocumentReference, wordId: number): Promise<void> => {
  try {
    // Update the wordIds array in Firestore to remove the wordId
    await updateDoc(wordListRef, {
      wordIds: arrayRemove(wordId)
    });

    console.log("Word removed from the word list successfully");
  } catch (error) {
    console.error("Error removing word from word list: ", error);
    throw error;
  }
};

const editWordList = async (wordListRef: DocumentReference, newTitle?: string, newDescription?: string): Promise<void> => {
  try {
    const updateData: Partial<WordList> = {};
    if (newTitle !== undefined) updateData.title = newTitle;
    if (newDescription !== undefined) updateData.description = newDescription;

    // Update the word list with the provided fields
    await updateDoc(wordListRef, updateData);

    console.log("Word list updated successfully");
  } catch (error) {
    console.error("Error updating word list: ", error);
    throw error;
  }
};

const getUserWordLists = async (db: Firestore, userUid: string): Promise<WordList[]> => {
  try {
    const q = query(collection(db, "wordLists"), where("userUid", "==", userUid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as WordList);

  } catch (error) {
    console.error("Error fetching user's word lists: ", error);
    throw error;
  }
};

const getWordList = async (wordListRef: DocumentReference): Promise<WordList | null> => {
  try {
    const docSnap = await getDoc(wordListRef);
    if (docSnap.exists()) {
      return docSnap.data() as WordList;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting word list: ", error);
    throw error;
  }
};




