"use client";
import { ContextModalProps, closeModal, modals } from "@mantine/modals";
import { Text, Button, Input, Group } from "@mantine/core";
import React, { useState } from "react";
import { sendResetPassword } from "@/app/lib/firebase/authentication";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";

type Props = {};

const ResetPasswordModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{}>) => {
  const firebase = useFirebaseContext();
  const [resetEmail, setResetEmail] = useState("");
  const [hidePasswordResetSuccess, setHidePasswordResetSuccess] =
    useState(true);
  const [passwordResetError, setPasswordResetError] = useState("");

  return (
    <>
      <Text>
        Enter the email address associated with your account. An email will be
        sent to reset your password.
      </Text>
      <Input.Wrapper label="E-mail">
        <Input
          value={resetEmail}
          onChange={(event) => setResetEmail(event.currentTarget.value)}
        />
      </Input.Wrapper>
      <Text color="red"></Text>
      <Text color="green" hidden={hidePasswordResetSuccess}>
        Password reset sent successfully!
      </Text>
      <Group className="mt-5" justify="flex-end">
        <Button
          variant="filled"
          onClick={() => {
            console.log("send");
            setPasswordResetError("");
            setHidePasswordResetSuccess(true);
            sendResetPassword(firebase.auth, resetEmail)
              .then(() => {
                console.log("password reset send successfully");
                setHidePasswordResetSuccess(false);
              })
              .catch((error) => {
                console.log("password reset failed");
                setPasswordResetError(error.message);
              });
          }}
        >
          Send
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

export default ResetPasswordModal;
