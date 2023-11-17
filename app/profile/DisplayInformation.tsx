"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  rem,
  Text,
  Image,
  Center,
  FileInput,
  Input,
  Button,
} from "@mantine/core";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import {
  IconDeviceFloppy,
  IconPencil,
  IconUpload,
  IconUserCircle,
} from "@tabler/icons-react";
import { updateUserProfile } from "../lib/firebase/authentication";
import { doc, getDoc } from "firebase/firestore/lite";
import { updateUserToDB } from "../lib/firebase/firestore";
import { User, updateProfile } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

type Props = {};

const DisplayInformation = (props: Props) => {
  const firebase = useFirebaseContext();
  const [editDisplayName, setEditDisplayName] = useState(false);

  const [displayName, setDisplayName] = useState(
    firebase.currentUser?.displayName || ""
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setDisplayName(firebase.currentUser?.displayName || "");
  }, [firebase.currentUser]);

  const checkDisplayNameExists = async (displayName: string) => {
    const usersRef = collection(firebase.db, "users");
    const q = query(usersRef, where("displayName", "==", displayName));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const onSave = async () => {
    try {
      const displayNameExists = await checkDisplayNameExists(displayName);
      if (displayNameExists) {
        setErrorMessage("Display name already in use. Please choose another.");
        return;
      }

      if (firebase.auth.currentUser) {
        await updateUserProfile(firebase.auth, {
          displayName: displayName,
          photoUrl: firebase.currentUser?.photoURL as string,
        });

        const updatedUser = {
          ...firebase.auth.currentUser,
          displayName: displayName,
        };
        await updateUserToDB(firebase.db, updatedUser);
      }
      setEditDisplayName(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
      setErrorMessage("An error occurred while updating the profile.");
    }
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
        <Input.Wrapper label="Display Name">
          {editDisplayName ? (
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.currentTarget.value)}
            />
          ) : (
            <Group>
              <Text>{displayName}</Text>

              <IconPencil
                onClick={() => setEditDisplayName(true)}
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </Group>
          )}
        </Input.Wrapper>

        <Text size="sm" color="red">
          {errorMessage}
        </Text>

        {firebase.currentUser?.photoURL ? (
          <Image
            radius="md"
            h={150}
            w={150}
            src={firebase.currentUser?.photoURL}
          />
        ) : (
          <Card withBorder>
            <IconUserCircle
              style={{ width: rem(150), height: rem(150) }}
              stroke={1.5}
              color="gray"
            />
          </Card>
        )}
        <FileInput
          accept="image/png,image/jpeg"
          rightSection={
            <IconUpload
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          }
          onChange={setPhotoFile}
          label="Upload Profile Picture"
          placeholder="Upload"
          rightSectionPointerEvents="none"
        />
        <Button onClick={onSave}>Save</Button>
      </Flex>
    </Card>
  );
};

export default DisplayInformation;
