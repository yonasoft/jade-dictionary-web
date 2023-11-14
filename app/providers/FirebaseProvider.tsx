"use client";
import React, { useState, useContext, createContext, useEffect } from "react";
import { initializeFirebase } from "../lib/firebase/init";
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
} from "../lib/firebase/authentication";

type Props = {
  children: React.ReactNode;
};

type FirebaseContextType = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  createUserEmailPassword: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: any }>;
  signInWithEmailPassword: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: any }>;
  isLoggedIn: () => boolean;
  signOut: () => Promise<void>;
};

export const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

export const FirebaseContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const app = initializeFirebase();
  const auth = getAuth(app);
  setupEmulators(auth);

  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    monitorAuthState();
  }, []);

  const createUserEmailPassword = async (
    email: string,
    password: string
  ): Promise<{ user: User | null; error: any }> => {
    try {
      const { user, error } = await createNewUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { user: user, error: null };
    } catch (error) {
      console.error("Error creating user:", error);
      return { user: null, error: error };
    }
  };

  const signInWithEmailPassword = async (
    email: string,
    password: string
  ): Promise<{ user: User | null; error: any }> => {
    try {
      const user = await loginEmailAndPassword(auth, email, password);
      return { user, error: null };
    } catch (error) {
      console.error("Error signing in with email and password:", error);
      return { user: null, error };
    }
  };

  const isLoggedIn = () => {
    return auth.currentUser ? true : false;
  };

  const signOut = async () => {
    try {
      await signOutUser(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const monitorAuthState = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  };

  return (
    <FirebaseContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        createUserEmailPassword,
        signInWithEmailPassword,
        isLoggedIn,
        signOut,
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
