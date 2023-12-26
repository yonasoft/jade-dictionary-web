"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Flex,
  rem,
  Text,
  FileInput,
  Input,
  Button,
  Avatar,
} from "@mantine/core";
import { useFirebaseContext } from "../../providers/FirebaseProvider";
import {
  IconCheck,
  IconClearAll,
  IconDeviceFloppy,
  IconPencil,
  IconRefresh,
  IconUpload,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";
import { updateUserProfile } from "../../lib/firebase/authentication";
import { doc, getDoc } from "firebase/firestore/lite";
import {
  deleteOldProfilePicture,
  updateUserToDB,
  uploadNewProfilePicture,
} from "../../lib/firebase/storage/user";
import { User, updateProfile } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FirestoreUserData } from "../../lib/definitions";

type Props = {};

const DisplayInformation = (props: Props) => {
  const { currentUser, setCurrentUser, firestore, storage, auth } =
    useFirebaseContext();

  const [editDisplayName, setEditDisplayName] = useState(false);

  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || ""
  );
  const [displayPhoto, setDisplayPhoto] = useState(currentUser?.photoURL || "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [hideSuccess, setHideSuccess] = useState(true);

  useEffect(() => {}, [currentUser]);
  useEffect(() => {
    return () => {
      if (displayPhoto && displayPhoto.startsWith("blob:")) {
        URL.revokeObjectURL(displayPhoto);
      }
    };
  }, [displayPhoto]);

  const checkDisplayNameExists = async (displayName: string) => {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("displayName", "==", displayName));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const onSave = async () => {
    setErrorMessage("");
    setHideSuccess(true);

    try {
      if (isNewDisplayName()) {
        const exists = await checkDisplayNameExists(displayName);
        if (exists) {
          setErrorMessage(
            "Display name already in use. Please choose another."
          );
          return;
        }
      }

      let photoURL = currentUser?.photoURL;
      if (photoFile) {
        await deleteOldProfilePicture(
          storage,
          firestore,
          currentUser?.uid as string
        );
        photoURL = await uploadNewProfilePicture(
          storage,
          photoFile,
          currentUser?.uid as string
        );
      }

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
          photoURL: photoURL as string,
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

  const isNewDisplayName = () => {
    return displayName !== currentUser?.displayName;
  };

  const handleFileChange = (file: File | null) => {
    setPhotoFile(file);
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setDisplayPhoto(tempUrl);
    } else {
      // Reset to the original photo URL if no file is selected
      setDisplayPhoto(currentUser?.photoURL || "");
    }
  };

  const showDisplayNameInput = () => {
    return (
      <Input.Wrapper label="Display Name" fw={400}>
        {editDisplayName ? (
          <Flex justify="center" align="center" direction="row">
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.currentTarget.value)}
            />
            <IconCheck
              className="mx-2"
              onClick={() => {
                setEditDisplayName(false);
              }}
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
              color="green"
            />
            <IconX
              className="mx-2"
              onClick={() => {
                setDisplayName(currentUser?.displayName as string);
                setEditDisplayName(false);
              }}
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
              color="red"
            />
          </Flex>
        ) : (
          <Flex justify="center" align="center" direction="row">
            <Text>{displayName || currentUser?.displayName}</Text>

            <IconPencil
              className="mx-2"
              onClick={() => setEditDisplayName(true)}
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </Flex>
        )}
      </Input.Wrapper>
    );
  };

  return (
    <Card shadow="md" radius="md">
      <Flex
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        gap="sm"
      >
        {showDisplayNameInput()}
        <Avatar
          src={displayPhoto}
          alt="profile picture"
          size={150}
          radius="xl"
        />
        <FileInput
          accept="image/png,image/jpeg"
          rightSection={
            <IconUpload
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          }
          value={photoFile}
          onChange={handleFileChange} // Updated to use handleFileChange
          label="Upload Profile Picture"
          placeholder="Upload"
          rightSectionPointerEvents="none"
          className="max-w-full"
        />

        <Button className="my-2" variant="filled" onClick={onSave}>
          Save
        </Button>
        <Text size="sm" color="red">
          {errorMessage}
        </Text>
        <Text size="sm" color="green" hidden={hideSuccess}>
          Profile updated successfully.
        </Text>
      </Flex>
    </Card>
  );
};

export default DisplayInformation;
