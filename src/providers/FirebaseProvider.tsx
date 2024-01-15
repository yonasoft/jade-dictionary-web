"use client";
import React, { useState, useContext, createContext, useEffect } from "react";
import { getFirestore, Firestore } from "firebase/firestore";
import { User } from "@firebase/auth";
import { Auth, getAuth } from "firebase/auth";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Database, getDatabase } from "firebase/database";
import { monitorAuthState } from "../lib/firebase/authentication";
import { initializeFirebase } from "../lib/firebase/init";
import { getUserWordLists } from "../lib/firebase/storage/wordLists";
import { SortOption } from "../lib/types/dictionary";
import { WordList } from "../lib/types/word-list";


type Props = {
  children: React.ReactNode;
};

type FirebaseContextType = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  wordLists: WordList[];
  updateWordLists: () => void;
  auth: Auth;
  firestore: Firestore;
  db: Database;
  storage: FirebaseStorage;
};

export const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

export const FirebaseContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const app = initializeFirebase();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const db = getDatabase(app);
  const storage = getStorage(app);

  const [currentUser, setCurrentUser] = useState<null | User>(auth.currentUser);
  const [wordLists, setWordLists] = useState<WordList[]>([]);

  useEffect(() => {
    fetchWordLists();
  }, [currentUser, firestore]);

  useEffect(() => {
    monitorAuthState(auth, setCurrentUser);
  }, [auth]);

  const fetchWordLists = async () => {
    if (currentUser) {
      try {
        const lists = await getUserWordLists(
          firestore,
          currentUser.uid,
          SortOption.Recent
        );
        setWordLists(lists);
      } catch (error) {
        console.error("Error fetching word lists: ", error);
      }
    }
  };

  const updateWordLists = async () => {
    const lists = await getUserWordLists(
      firestore,
      currentUser?.uid as string,
      SortOption.Recent
    );
    setWordLists(lists);
  };

  return (
    <FirebaseContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        wordLists,
        updateWordLists,
        auth,
        firestore,
        db,
        storage,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error(
      "useFirebaseContext must be used within a FirebaseContextProvider"
    );
  }
  return context;
};
