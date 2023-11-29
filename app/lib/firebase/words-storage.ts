import { getDatabase, ref, query, orderByChild, equalTo, get, Database } from "firebase/database";
import { Word } from "../definitions";

export const searchSimplified = async (db:Database, simplifiedChar: string): Promise<Word[]> => {
  const entriesRef = ref(db, 'words');
  const searchQuery = query(entriesRef, orderByChild('simplified'), equalTo(simplifiedChar));

  try {
    const snapshot = await get(searchQuery);
    if (snapshot.exists()) {
      const data: Word[] = Object.values(snapshot.val());
      return data;
    } else {
      console.log('No matching words found.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

