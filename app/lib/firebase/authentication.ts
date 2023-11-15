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
} from "firebase/auth";


export async function setupEmulators(auth:Auth) {
  const authUrl = 'http://127.0.0.1:9099'
  await fetch(authUrl)
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
}

export const createNewUserWithEmailAndPassword = async (auth: Auth, email: string, password: string):Promise<{user:User|null, error: any}> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    console.log(userCredential)
    return { user: userCredential.user, error: null }
  } 
  catch (error) {
    console.log(error)
    return {user: null, error: error}
  }
}

export const loginEmailAndPassword = async (auth: Auth, email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const signInWithGoogle = async (auth: Auth): Promise<{ user: User | null; error: any }> => { 
  const provider = new GoogleAuthProvider();
  try {
    // Initiate the sign-in process
    await signInWithRedirect(auth, provider);

    // Once the user is redirected back to your app, get the sign-in result
    const result = await getRedirectResult(auth);
    if (result) {
      // Successfully signed in
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

export const signInWithFacebook = async (auth: Auth): Promise<{ user: User | null; error: any }> => { 

  const provider = new FacebookAuthProvider();
  try {
    // Initiate the sign-in process
    await signInWithRedirect(auth, provider);

    // Once the user is redirected back to your app, get the sign-in result
    const result = await getRedirectResult(auth);
    if (result) {
      // Successfully signed in
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
