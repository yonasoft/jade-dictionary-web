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
  updatePassword,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  AuthCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
  EmailAuthProvider,
} from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { addNewUserToDB } from "./storage";
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
      console.log(result);
      await addNewUserToDB(db, result.user);
      return { user: result.user, error: null };
    } else {
      return { user: null, error: null };
    }
  } catch (error: any) {
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
      return { user: null, error: null };
    }
  } catch (error: any) {
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

  }).catch((error) => {

  });
}

export const reauthenticate = async (auth: Auth) => {

  //TODO: Reaunthentication
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user is currently signed in.");
  }

  // Here, you will need to obtain the necessary credentials based on the provider.
  // For example, for email/password, you might prompt the user to re-enter their password.
  // For Google or Facebook, you might use a refreshed token.
  // This part of the implementation depends on your app's specific logic and UX.

  const providerId = user.providerData[0]?.providerId;
  let credential;

  switch (providerId) {
    case 'password':
      // Prompt the user to re-enter their password
      const email = user.email;
      const password = "user's current password"; // This should be obtained from the user
      credential = EmailAuthProvider.credential(email as string, password);
      break;

    case 'google.com':
      // Use the Google OAuth access token
      const googleToken = "user's Google OAuth access token"; // This should be obtained from the user or your app's auth flow
      credential = GoogleAuthProvider.credential(googleToken);
      break;

    case 'facebook.com':
      // Use the Facebook OAuth access token
      const facebookToken = "user's Facebook OAuth access token"; // This should be obtained from the user or your app's auth flow
      credential = FacebookAuthProvider.credential(facebookToken);
      break;

    // ... add cases for other providers as needed

    default:
      throw new Error(`Unsupported provider: ${providerId}`);
  }

  try {
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    console.error(error);
    throw error; // Or handle the error as per your application's error handling policy
  }
}

export const updateUserEmail = async (auth: Auth, email: string) => { 

  reauthenticate(auth).then(async () => {
    await verifyBeforeUpdateEmail(auth.currentUser as User, email).then(() => {
      console.log("Email updated successfully to: ", email)
    }).catch((error) => {
      console.error(error);
    });
  }).catch((error) => {
    console.error(error);
   })
}

export const updateUserPassword = async (auth: Auth, password: string) => { 
  reauthenticate(auth).then(async () => {
    await updatePassword(auth.currentUser as User, password).then(() => {

    }).catch((error) => {

    });
  }).catch((error) => { });
}

export const sendVerificationEmail = async (auth: Auth) => { 
  await sendEmailVerification(auth.currentUser as User);
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
  
export const sendResetPassword = async (auth: Auth, email: string) => {

  reauthenticate(auth).then(async () => {
    await sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent successfully")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }).catch((error) => {});
}
 
export const deleteAUser = async (auth: Auth) => { 
  reauthenticate(auth).then(async () => {
    await deleteUser(auth.currentUser as User).then(() => {
      console.log(`User ${auth.currentUser?.uid} deleted successfully`)
    }).catch((error) => {
      console.error(error);
    });
    }).catch((error) => {
    console.error(error);
   });
}