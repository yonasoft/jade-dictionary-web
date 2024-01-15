"use client";
import { ContextModalProps, openContextModal } from "@mantine/modals";
import { Text, Button, Group, Input } from "@mantine/core";
import React, { useState } from "react";
import { useFirebaseContext } from "@/src/providers/FirebaseProvider";
import classes from "./DeleteUserConfirmation.module.css";
import { deleteAUser } from "@/src/lib/firebase/authentication";

const DeleteUserConfirmation = ({
  context,
  id,
}: ContextModalProps<{ setRequireReauth: () => void }>) => {
  const firebase = useFirebaseContext();
  const [confirmInput, setConfirmInput] = useState("");
  const [hideError, setHideError] = useState(true);
  const [accountDeleted, setAccountDeleted] = useState(false);

  const handleReauthAndDelete = async () => {
    openContextModal({
      modal: "reAuth",
      title: "Please re-authenticate to continue.",
      innerProps: {
        onSuccess: async () => {
          try {
            await deleteAUser(
              firebase.firestore,
              firebase.storage,
              firebase.auth
            );
            setAccountDeleted(true);
          } catch (error) {
            console.error(
              "Failed to delete account after reauthentication:",
              error
            );
          }
        },
      },
    });
  };

  const handleDeleteAccount = async () => {
    setHideError(true);
    if (confirmInput !== "Delete Account") {
      setHideError(false);
      return;
    }

    try {
      await deleteAUser(
        firebase.firestore,
        firebase.storage,
        firebase.auth
      ).then(() => {
        setAccountDeleted(true); // Account deleted
      });
    } catch (error: any) {
      console.error("Account deletion failed:", error);
      if (error.code === "auth/requires-recent-login") {
        handleReauthAndDelete(); // Handle reauthentication and retry deletion
      } else {
        console.error("Failed to delete account. Please try again later.");
      }
    }
  };

  return accountDeleted ? (
    <Text>Account Deleted!</Text>
  ) : (
    <>
      <Text>
        Are you sure you want to delete your account? This action cannot be
        reverted. To confirm, please type:
      </Text>
      <Text fw={700}>"Delete Account"</Text>

      <Input
        value={confirmInput}
        onChange={(event) => {
          setConfirmInput(event.currentTarget.value);
        }}
      />
      <Text color="red" hidden={hideError}>
        Input does not match.
      </Text>
      <Group className="mt-5" justify="flex-end">
        <Button className={classes.deleteButton} onClick={handleDeleteAccount}>
          Delete
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            console.log("cancel");
            context.closeModal(id);
          }}
        >
          Cancel
        </Button>
      </Group>
    </>
  );
};

export default DeleteUserConfirmation;
