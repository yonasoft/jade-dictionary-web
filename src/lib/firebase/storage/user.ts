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
    photoURL: userData.photoURL,
  };

  try {
    await setDoc(doc(db, "users", userData.uid), dataToSave);
  } catch (e) {
    console.error("Error updating user in DB:", e);
  }
};

export const deleteOldProfilePicture = async (
  storage: FirebaseStorage,
  db: Firestore,
  userUid: string
) => {
  const userInDB = await getDoc(doc(db, "users", userUid));
  const userData = userInDB.data();
  const fileName = userData?.photoFileName ;
  const storageRef = ref(storage, `${userUid}/profile_pictures/${fileName}`);

  deleteObject(storageRef)
    .then(() => {})
    .catch((error) => {});
};

export const uploadNewProfilePicture = async (
  storage: FirebaseStorage,
  db:Firestore,
  file: File,
  userUid: string
): Promise<string> => {
  const storageRef = ref(storage, `${userUid}/profile_pictures/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  console.log("Uploaded a blob or file!");
  const url = await getDownloadURL(snapshot.ref);
  let oldFileName = ""
  await getDoc(doc(db, "users", userUid)).then((doc) => { 
    oldFileName = doc.data()?.photoFileName
  });
  setDoc(doc(db, "users", userUid), { photoFileName: file.name || oldFileName }, { merge: true })
  console.log("Profile picture URL:", url);
  return url;
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
