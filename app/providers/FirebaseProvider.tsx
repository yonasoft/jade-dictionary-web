"use client";
import React, { useState, useContext, createContext, useEffect } from "react";
import { initializeFirebase } from "../lib/firebase/init";
import { getFirestore, doc, updateDoc, Firestore } from "firebase/firestore";
import { User } from "@firebase/auth";
import {
  Auth,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  loginEmailAndPassword,
  setupEmulators,
  signInWithGoogle,
  signInWithFacebook,
  signOutUser,
  createNewUserWithEmailAndPassword,
  monitorAuthState,
} from "../lib/firebase/authentication";
import {
  FirebaseStorage,
  StorageReference,
  getStorage,
  ref,
} from "firebase/storage";

type Props = {
  children: React.ReactNode;
};

type FirebaseContextType = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  auth: Auth;
  db: Firestore;
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
  const db = getFirestore(app);
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