"use client";
import {
  ContextModalProps,
  closeModal,
  modals,
  openContextModal,
} from "@mantine/modals";
import { Text, Button, Group } from "@mantine/core";
import React, { useState } from "react";
import { deleteAUser } from "@/app/lib/firebase/authentication";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import classes from "./DeleteUserConfirmation.module.css";

type Props = {};

const DeleteUserConfirmation = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{}>) => {
  const firebase = useFirebaseContext();
  const [accountDeleted, setAccountDeleted] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await deleteAUser(firebase.auth);
      setAccountDeleted(true); // Update state to show account deletion success
      context.closeModal(id); // Close the modal after successful deletion
    } catch (error: any) {
      console.error("Account deletion failed:", error);
      if (error.code === "auth/requires-recent-login") {
        // Open reauthentication modal if reauthentication is required
        openContextModal({
          modal: "reAuth",
          title: "Please re-authenticate to continue.",
          innerProps: {},
          onClose: () => {
            // Attempt to delete the user again after reauthentication
            handleDeleteAccount();
          },
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
