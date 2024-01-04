"use client";
import React, { useEffect } from "react";
import {
  Card,
  Flex,
  rem,
  Text,
  FileInput,
  Button,
  Avatar,
} from "@mantine/core";
import { useFirebaseContext } from "../../../../providers/FirebaseProvider";
import { IconUpload } from "@tabler/icons-react";
import { useDisplayInformation } from "@/app/hooks/useDisplayInformation";
import { DisplayNameInput } from "./DisplayNameInput";

type Props = {};

const DisplayInformation = (props: Props) => {
  const { currentUser } = useFirebaseContext();

  const {
    editDisplayName,
    setEditDisplayName,
    displayName,
    setDisplayName,
    displayPhoto,
    photoFile,
    handleFileChange,
    errorMessage,
    hideSuccess,
    onSave,

  } = useDisplayInformation();

  useEffect(() => {}, [currentUser]);
  useEffect(() => {
    return () => {
      if (displayPhoto && displayPhoto.startsWith("blob:")) {
        URL.revokeObjectURL(displayPhoto);
      }
    };
  }, [displayPhoto]);

  return (
    <Card shadow="md" radius="md">
      <Flex
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        gap="sm"
      >
        <DisplayNameInput
          editDisplayName={editDisplayName}
          setEditDisplayName={setEditDisplayName}
          displayName={displayName}
          setDisplayName={setDisplayName}
          currentUser={currentUser}
        />
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
