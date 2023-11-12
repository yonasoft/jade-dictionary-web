"use client";
import React, { useState, useContext, createContext } from "react";
import { initializeFirebase } from "../lib/firebase/init";
import { User } from "@firebase/auth";
import { getAuth } from "firebase/auth";
import {
  loginEmailAndPassword,
  setupEmulators,
  signInWithGoogle,
  signInWithFacebook,
  signOut,
  createNewUserWithEmailAndPassword,
} from "../lib/firebase/authentication";
import { signInMethod } from "../lib/definitions";

type Props = {
  children: React.ReactNode;
};

type FirebaseContext = {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

export const FirebaseContext = createContext<FirebaseContext | undefined>(
  undefined
);

export const FirebaseContextProvider = ({ children }: Props) => {
  const app = initializeFirebase();
  const auth = getAuth(app);
  setupEmulators(auth);

  const [user, setUser] = useState<User | undefined>(undefined);

  const signIn = async (
    signInMethod: signInMethod,
    email?: string,
    password?: string
  ) => {
    try {
      let result;
      switch (signInMethod) {
        case "email":
          result = await loginEmailAndPassword(
            auth,
            email as string,
            password as string
          );
          break;
        case "google":
          await signInWithGoogle(auth);
          break;
        case "facebook":
          await signInWithFacebook(auth);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // Handle error, potentially update context state
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      // Handle successful sign out, update context state
    } catch (error) {
      console.error("Sign out error:", error);
      // Handle sign out error
    }
  };

  const createUserEmailPasaword = async (email: string, password: string) => {
    try {
      await createNewUserWithEmailAndPassword(auth, email, password);
      // Handle successful user creation, update context state
    } catch (error) {
      console.error("Error creating user:", error);
      // Handle user creation error
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error(
      "ueseFirebaseContext must be used within a FirebaseContextProvider"
    );
  }
  return context;
};
