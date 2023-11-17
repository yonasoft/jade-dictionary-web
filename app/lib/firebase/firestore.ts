import { User } from "@firebase/auth";
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore, doc, setDoc, addDoc, collection } from "firebase/firestore";

export const addNewUserToDB = async (db: Firestore, user: User) => {
    try {
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        });
        console.log("Document written with ID: ", user.uid);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const updateUserToDB = async (db: Firestore, user: User) => { 
	try {
		await setDoc(doc(db, "users", user.uid), {
			uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
		});
	} catch (e) {

	 }
}