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
} from "firebase/auth";
import { FirebaseApp } from "firebase/app";


export const setupEmulators = async (auth: Auth) => {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
}

export const createNewUserWithEmailAndPassword = async (auth: Auth, email: string, password: string) => {
	await createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
      const user = userCredential.user;
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
      console.log(errorCode, errorMessage)

		});
}
export const loginEmailAndPassword = async (auth:Auth, email: string, password: string): Promise<{ user: User | null; error: any }> => {
	await signInWithEmailAndPassword(auth, email, password)
	.then((userCredential) => { 
    const user = userCredential.user;
    return { user: user };
	})
	.catch((error) => {
		const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage)
    return { error: error };
  });
  return { user: null, error: null };
}

export const signInWithGoogle = async (auth:Auth) => { 
	const provider = new GoogleAuthProvider();

	await signInWithRedirect(auth, provider);
  await getRedirectResult(auth)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result as UserCredential);
      const token = credential?.accessToken;

      // The signed-in user info.
      const user = result?.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

export const signInWithFacebook = (auth:Auth) => { 
  const provider = new FacebookAuthProvider();
  signInWithRedirect(auth, provider);
  getRedirectResult(auth)
  .then((result) => {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result as UserCredential);
    const token = credential?.accessToken;

    const user = result?.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);
    // ...
  });
}


export const signOut = (auth:Auth) => {
  auth.signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}