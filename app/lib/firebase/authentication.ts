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
    try {
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
        const result = await getRedirectResult(auth);
    
        return { user: result?.user as User, error: null };
    } catch (error: any) {
        console.error(error.code, error.message);
        return { user: null, error };
    }
};

export const signInWithFacebook = async (auth: Auth): Promise<{ user: User | null; error: any }> => { 
    try {
        const provider = new FacebookAuthProvider();
        await signInWithRedirect(auth, provider);
        const result = await getRedirectResult(auth);
        return { user: result?.user as User, error: null };
    } catch (error: any) {
        console.error(error);
        return { user: null, error };
    }
};

export const signOutUser = async (auth: Auth): Promise<void> => {
        signOut(auth).then(() => {
        // Sign-out successful.
            console.log("Signed out successfully")
        }).catch((error) => {
          console.error(error)
        });
};
