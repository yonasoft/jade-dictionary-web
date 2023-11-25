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
import { useFirebaseContext } from "../providers/FirebaseProvider";
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
import { updateUserProfile } from "../lib/firebase/authentication";
import { doc, getDoc } from "firebase/firestore/lite";
import {
  deleteOldProfilePicture,
  updateUserToDB,
  uploadNewProfilePicture,
} from "../lib/firebase/storage";
import { User, updateProfile } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FirestoreUserData } from "../lib/definitions";
import classes from "./page.module.css";

type Props = {};

const DisplayInformation = (props: Props) => {
  const firebase = useFirebaseContext();

  const [editDisplayName, setEditDisplayName] = useState(false);
  const [displayName, setDisplayName] = useState(
    firebase.currentUser?.displayName || ""
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [hideSuccess, setHideSuccess] = useState(true);

  useEffect(() => {}, [firebase.currentUser]);

  const checkDisplayNameExists = async (displayName: string) => {
    const usersRef = collection(firebase.firestore, "users");
    const q = query(usersRef, where("displayName", "==", displayName));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const onSave = async () => {
    setErrorMessage("");
    setHideSuccess(true);
    try {
      if (isNewDisplayName()) {
        const displayNameExists = await checkDisplayNameExists(displayName);
        if (displayNameExists) {
          setErrorMessage(
            "Display name already in use. Please choose another."
          );
          return;
        }
      }

      let photoURL = firebase.currentUser?.photoURL;

      if (photoFile) {
        await deleteOldProfilePicture(
          firebase.storage,
          firebase.firestore,
          firebase.currentUser?.uid?.toString() as string
        );

        photoURL = await uploadNewProfilePicture(firebase.storage, photoFile);
      }

      if (firebase.auth.currentUser) {
        await updateUserProfile(firebase.auth, {
          displayName: displayName,
          photoUrl: photoURL as string,
        });

        const updatedUserData: FirestoreUserData = {
          uid: firebase.auth.currentUser.uid,
          email: firebase.auth.currentUser.email,
          displayName: displayName,
          photoURL: photoURL as string,
          photoFileName: photoFile?.name as string,
        };
        await updateUserToDB(firebase.firestore, updatedUserData);
      }
      setEditDisplayName(false);
      setHideSuccess(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating user profile:", error);
      setErrorMessage("An error occurred while updating the profile.");
    }
  };

  const isNewDisplayName = () => {
    return displayName !== firebase.currentUser?.displayName;
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
                setDisplayName(firebase.currentUser?.displayName as string);
                setEditDisplayName(false);
              }}
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
              color="red"
            />
          </Flex>
        ) : (
          <Flex justify="center" align="center" direction="row">
            <Text>{firebase.currentUser?.displayName}</Text>

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
            src={firebase.currentUser?.photoURL || ""}
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
            onChange={setPhotoFile}
            label="Upload Profile Picture"
            placeholder="Upload"
            rightSectionPointerEvents="none"
          />
          <Button className={`${classes.jadeButtons} my-2`} onClick={onSave}>
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
