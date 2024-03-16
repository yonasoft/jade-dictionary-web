import { User } from "firebase/auth";
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FirebaseStorage } from "firebase/storage";
import {
  deleteOldProfilePicture,
  uploadNewProfilePicture,
} from "../firebase/storage/user";

export const checkDisplayNameExists = async (
  firestore: Firestore,
  displayName: string
) => {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("displayName", "==", displayName));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const isNewDisplayName = (displayName: string, currentUser: User) => {
  return displayName !== currentUser?.displayName;
};

export const deleteAndUploadNewPhoto = async (
  photoFile: File | null,
  storage: FirebaseStorage,
  currentUser: User,
  firestore: Firestore
): Promise<string | null> => {
  if (photoFile) {
    await deleteOldProfilePicture(storage, firestore, currentUser);
    return await uploadNewProfilePicture(
      storage,
      firestore,
      photoFile,
      currentUser
    );
  } else {
    return null;
  }
};
