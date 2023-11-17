import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  UserCredential,
  FacebookAuthProvider,
  connectAuthEmulator,
  sendSignInLinkToEmail,
  User,
  Auth,
  signOut,
  updateProfile,
  updateEmail,
} from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { addNewUserToDB } from "./firestore";
import { Dispatch, SetStateAction } from "react";


export async function setupEmulators(auth:Auth) {
  const authUrl = 'http://127.0.0.1:9099'
  await fetch(authUrl)
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
}

export const createNewUserWithEmailAndPassword = async (auth: Auth, db:Firestore, email: string, password: string):Promise<{user:User|null, error: any}> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(userCredential);
    await addNewUserToDB(db, userCredential.user);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.log(error);
    // Check for email-already-in-use error code
    if (error.code === 'auth/email-already-in-use') {
      return { user: null, error: 'Email already in use. Please use a different email.' };
    }
    return { user: null, error: error.message };
  }
};

export const loginEmailAndPassword = async (auth: Auth, email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const signInWithGoogle = async (auth: Auth, db:Firestore, ): Promise<{ user: User | null; error: any }> => { 
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider)
    if (result) {
      // Successfully signed in
      console.log(result);
      await addNewUserToDB(db, result.user);
      return { user: result.user, error: null };
    } else {
      // No result, possibly because the sign-in was not initiated now
      return { user: null, error: null };
    }
  } catch (error: any) {
    // Handle any errors that occurred during sign-in
    console.error(error);
    return { user: null, error };
  }
};

export const signInWithFacebook = async (auth: Auth, db:Firestore): Promise<{ user: User | null; error: any }> => { 

  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider)
    if (result) {
      // Successfully signed in
      await addNewUserToDB(db, result.user);
      return { user: result.user, error: null };
    } else {
      // No result, possibly because the sign-in was not initiated now
      return { user: null, error: null };
    }
  } catch (error: any) {
    // Handle any errors that occurred during sign-in
    console.error(error);
    return { user: null, error };
  }
};

export const signOutUser = async (auth: Auth): Promise<void> => {
  signOut(auth).then(() => {
    console.log("Signed out successfully")
  }).catch((error) => {
          console.error(error)
  });
};

export const updateUserProfile = async (auth: Auth, data: { displayName: string, photoUrl: string }) => {
  const { displayName, photoUrl } = data
  updateProfile(auth.currentUser as User, {
    displayName: displayName, photoURL: photoUrl
  }).then(() => {
    // Profile updated!
    // ...
  }).catch((error) => {
    // An error occurred
    // ...
  });
}

export const updateUserEmail = async (auth: Auth, email:string) => { 
  updateEmail(auth.currentUser as User, email).then(() => {
    // Email updated!
    // ...
  }).catch((error) => {
    // An error occurred
    // ...
  });
}

export const monitorAuthState = async(auth:Auth, action:Dispatch<SetStateAction<User|null>>) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        action(user);
      } else {
        action(null);
      }
    });
  };
