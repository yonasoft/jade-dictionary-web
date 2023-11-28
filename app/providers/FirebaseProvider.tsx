"use client";
import React, { useState, useContext, createContext, useEffect } from "react";
import { initializeFirebase } from "../lib/firebase/init";
import { getFirestore, doc, updateDoc, Firestore } from "firebase/firestore";
import { User } from "@firebase/auth";
import {
  Auth,

  getAuth,
} from "firebase/auth";
import {
  loginEmailAndPassword,

  monitorAuthState,
} from "../lib/firebase/authentication";
import {
  FirebaseStorage,
  StorageReference,
  getStorage,
  ref,
} from "firebase/storage";
import { Database, getDatabase } from "firebase/database";

type Props = {
  children: React.ReactNode;
};

type FirebaseContextType = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
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

  useEffect(() => {
    monitorAuthState(auth, setCurrentUser);
  }, [auth]);

  return (
    <FirebaseContext.Provider
      value={{
        currentUser,
        setCurrentUser,
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
