import { User } from "@firebase/auth";
import { initializeApp } from "firebase/app";
import {
  Firestore,
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  getDoc,
  query,
  getDocs,
  where,
  deleteDoc,
} from "firebase/firestore";
import {
  FirebaseStorage,
  StorageReference,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { updateUserProfile } from "../authentication";

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
};

export const updateUserToDB = async (db: Firestore, userData: User) => {
  const dataToSave = {
    uid: userData.uid,
    email: userData.email,
    displayName: userData.displayName,
    photoUrl: userData.photoURL,
  };

  try {
    await setDoc(doc(db, "users", userData.uid), dataToSave, { merge: true });
  } catch (e) {
    console.error("Error updating user in DB:", e);
  }
};

export const deleteOldProfilePicture = async (
  storage: FirebaseStorage,
  db: Firestore,
  user: User
) => {
  const userInDB = await getDoc(doc(db, "users", user.uid));
  const userData = userInDB.data();
  const fileName = userData?.photoFileName;
  const storageRef = ref(storage, `${user.uid}/profile_pictures/${fileName}`);

  deleteObject(storageRef)
    .then(() => {})
    .catch((error) => {});
};

export const uploadNewProfilePicture = async (
  storage: FirebaseStorage,
  db: Firestore,
  file: File,
  user: User
): Promise<string> => {
  try {
    const storageRef = ref(
      storage,
      `${user.uid}/profile_pictures/${file.name}`
    );
    const snapshot = await uploadBytes(storageRef, file);
    console.log(file.name, "uploaded to Firebase Storage");

    const url = await getDownloadURL(snapshot.ref);

    const upload = {
      photoFileName: file.name,
      uid: user.uid,
      displayName: user.displayName,
      photoUrl: url, // Assuming you want to update the photoURL with the new URL
    };

    console.log("upload", upload);

    await setDoc(doc(db, "users", user.uid), upload, { merge: true });
    console.log("Document successfully updated with ID:", user.uid);

    return url;
  } catch (error) {
    console.error("Error uploading new profile picture:", error);
    throw error; // Re-throw the error so the caller can handle it
  }
};

export const checkEmailExists = async (
  db: Firestore,
  email: string
): Promise<boolean> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const deleteuserFromDB = async (db: Firestore, userUid: string) => {
  await deleteDoc(doc(db, "users", userUid))
    .then(() => {
      console.log("User document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing user document: ", error);
    });
};
