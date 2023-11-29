"use client";
import {
  ContextModalProps,
  closeModal,
  modals,
  openContextModal,
} from "@mantine/modals";
import { Text, Button, Group } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { deleteAUser } from "@/app/lib/firebase/authentication";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import classes from "./DeleteUserConfirmation.module.css";

type Props = {};

const DeleteUserConfirmation = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ setRequireReauth: () => void }>) => {
  const firebase = useFirebaseContext();
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    if (authSuccess) {
      deleteAUser(firebase.auth).then(() => {
        setAccountDeleted(true); //
      });
    }
  }, [authSuccess]);

  const handleDeleteAccount = async () => {
    try {
      await deleteAUser(firebase.auth).then(() => {
        setAccountDeleted(true); //
      });
    } catch (error: any) {
      console.error("Account deletion failed:", error);
      if (error.code === "auth/requires-recent-login") {
        // Open reauthentication modal if reauthentication is required
        openContextModal({
          modal: "reAuth",
          title: "Please re-authenticate to continue.",
          innerProps: {
            onSuccess: () => {
              setAuthSuccess(true);
            },
          },
          onClose: async () => {},
        });
      } else {
        // Handle other errors
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
        reverted.
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
