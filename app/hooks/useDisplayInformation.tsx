import { useState } from "react";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import { User } from "firebase/auth";
import { updateUserProfile } from "../lib/firebase/authentication";
import { updateUserToDB } from "../lib/firebase/storage/user";
import { checkDisplayNameExists, deleteAndUploadNewPhoto, isNewDisplayName } from "../lib/utils/profile";


export const useDisplayInformation = () => {
  const { currentUser, firestore, storage, auth, setCurrentUser } =
    useFirebaseContext();
  const [editDisplayName, setEditDisplayName] = useState(false);
  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || ""
  );
  const [displayPhoto, setDisplayPhoto] = useState(currentUser?.photoURL || "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [hideSuccess, setHideSuccess] = useState(true);

  const handleFileChange = (file: File | null) => {
    setPhotoFile(file);
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setDisplayPhoto(tempUrl);
    } else {
      setDisplayPhoto(currentUser?.photoURL || "");
    }
  };

  const onSave = async () => {
    setErrorMessage("");
    setHideSuccess(true);

    try {
      if (isNewDisplayName(displayName, currentUser as User)) {
        const exists = await checkDisplayNameExists(firestore, displayName);
        if (exists) {
          setErrorMessage(
            "Display name already in use. Please choose another."
          );
          return;
        }
      }

      const photoURL = await deleteAndUploadNewPhoto(
        photoFile,
        storage,
        currentUser as User,
        firestore
      );

      if (auth.currentUser) {
        await updateUserProfile(auth, {
          displayName: displayName,
          photoUrl: photoURL as string,
        });

        const updatedUserData: User = {
          ...auth.currentUser,
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          displayName: displayName,
          photoURL: (photoURL as string) || auth.currentUser.photoURL,
          emailVerified: auth.currentUser.emailVerified,
        };

        await updateUserToDB(firestore, updatedUserData);
        setCurrentUser(updatedUserData);
      }

      setEditDisplayName(false);
      setHideSuccess(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
      setErrorMessage("An error occurred while updating the profile.");
    }
  };

  return {
    editDisplayName,
    setEditDisplayName,
    displayName,
    setDisplayName,
    displayPhoto,
    photoFile,
    handleFileChange,
    errorMessage,
    setErrorMessage,
    hideSuccess,
    onSave,
  };
};
