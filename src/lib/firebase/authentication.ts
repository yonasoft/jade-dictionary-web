import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  FacebookAuthProvider,
  connectAuthEmulator,
  sendSignInLinkToEmail,
  User,
  Auth,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  AuthCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
  EmailAuthProvider,
  UserCredential,
} from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { addNewUserToDB, deleteOldProfilePicture, deleteuserFromDB } from "./storage/user";
import { Dispatch, SetStateAction } from "react";
import { FirebaseStorage } from "firebase/storage";

export async function setupEmulators(auth:Auth) {
  const authUrl = 'http://127.0.0.1:9099'
  await fetch(authUrl)
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
}

export const createNewUserWithEmailAndPassword = async (auth: Auth, db:Firestore, email: string, password: string):Promise<UserCredential | any> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(userCredential);
    await addNewUserToDB(db, userCredential.user);
    return userCredential;
  } catch (error: any) {
    console.log(error);
    if (error.code === 'auth/email-already-in-use') {
      return "Email already in use"
    }
    return error;
  }
};

export const loginEmailAndPassword = async (auth: Auth, email: string, password: string): Promise<UserCredential> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
};

export const signInWithGoogle = async (auth: Auth, db:Firestore, ): Promise< UserCredential |  any > => { 
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider)
    if (result) {
      console.log(result);
      await addNewUserToDB(db, result.user);
      return result;
    } else {
      return result;
    }
  } catch (error: any) {
    console.error(error);
    return error;
  }
};

export const signInWithFacebook = async (auth: Auth, db:Firestore): Promise< UserCredential | any > => { 
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider)
    if (result) {
      console.log(result);
      await addNewUserToDB(db, result.user);
      return result;
    } else {
      return result;
    }
  } catch (error: any) {
    console.error(error);
    return error;
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

  }).catch((error) => {
    console.error(error);
  });
}

export const sendVerificationEmail = async (auth: Auth) => { 
  await sendEmailVerification(auth.currentUser as User);
}

export const updateUserEmail = async (auth: Auth, email: string) => { 
    await verifyBeforeUpdateEmail(auth.currentUser as User, email).then(() => {
      console.log("Email updated successfully to: ", email)
    }).catch((error) => {
      console.error(error);
    });
}

export const updateUserPassword = async (auth: Auth, password: string) => { 
    await updatePassword(auth.currentUser as User, password).then(() => {
      console.log("Password updated successfully")
    }).catch((error) => {

    });
}

export const monitorAuthState = async(auth:Auth, action:Dispatch<SetStateAction<User|null>>) => {
    onAuthStateChanged(auth, (user) => {
    if (user) {
      action(user);
    } else {
      action(null);
    }
  });
};
  
export const sendResetPassword = async (auth: Auth, email: string) => {
    await sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent successfully")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
}
 
export const deleteAUser = async (firestore:Firestore, storage:FirebaseStorage, auth: Auth ) => { 
  await deleteUser(auth.currentUser as User)
    .then(() => {
      console.log("User deleted successfully")
      if (auth.currentUser?.photoURL) {
        deleteOldProfilePicture(storage, firestore, auth.currentUser)
      }
      deleteuserFromDB(firestore, auth.currentUser?.uid as string)
    })
}