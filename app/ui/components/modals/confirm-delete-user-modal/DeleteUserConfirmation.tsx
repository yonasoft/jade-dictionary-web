"use client";
import { ContextModalProps, closeModal, modals } from "@mantine/modals";
import { Text, Button, Input, Group } from "@mantine/core";
import React, { useState } from "react";
import {
  deleteAUser,
  sendResetPassword,
} from "@/app/lib/firebase/authentication";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import classes from "./DeleteUserConfirmation.module.css";

type Props = {};

const DeleteUserConfirmation = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{}>) => {
  const firebase = useFirebaseContext();
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [hideEmailConfirmationError, setHideEmailError] = useState(true);

  return accountDeleted ? (
    <Text>Account Deleted!</Text>
  ) : (
    <>
      <Text>
        Are you sure you want to delete your account? This action cannot be
        reverted. Enter your email to confirm.
      </Text>
      <Input.Wrapper label="E-mail">
        <Input
          value={confirmationEmail}
          onChange={(event) => setConfirmationEmail(event.currentTarget.value)}
        />
      </Input.Wrapper>
      <Text color="red" hidden={hideEmailConfirmationError}>
        Email does not match.
      </Text>
      <Group className="mt-5" justify="flex-end">
        <Button
          className={classes.deleteButton}
          onClick={() => {
            if (confirmationEmail === firebase.auth.currentUser?.email) {
              setHideEmailError(true);
              deleteAUser(firebase.auth)
                .then(() => {
                  setAccountDeleted(true);
                })
                .catch((error) => {
                  console.error(error);
                });
            } else {
              setHideEmailError(false);
            }
          }}
        >
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
