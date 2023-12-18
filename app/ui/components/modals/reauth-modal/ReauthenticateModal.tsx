"use client";
import {
  signInWithFacebook,
  signInWithGoogle,
} from "@/app/lib/firebase/authentication";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { Button, Center, PasswordInput, Text, TextInput } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import {
  AuthCredential,
  EmailAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { GoogleButton } from "../../auth-items/GoogleButton";
import { FacebookButton } from "../../auth-items/FacebookButton";

const ReauthenticateModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ onSuccess: () => void }>) => {
  const { auth } = useFirebaseContext();
  const providerId: string = auth.currentUser!.providerData[0].providerId;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleReauthenticate = async () => {
    if (!auth.currentUser) {
      console.error("No user is currently signed in");
      return;
    }

    try {
      let credential: AuthCredential;

      switch (providerId) {
        case "password":
          credential = EmailAuthProvider.credential(email, password);
          reauthenticateWithCredential(auth.currentUser, credential).then(
            () => {
              if (innerProps.onSuccess) innerProps.onSuccess(); // Call the success callback
              context.closeModal(id);
            }
          );
          break;
        case "google.com":
          reauthenticateWithPopup(
            auth.currentUser,
            new GoogleAuthProvider()
          ).then(() => {
            if (innerProps.onSuccess) innerProps.onSuccess(); // Call the success callback
            context.closeModal(id);
          });

          break;
        case "facebook.com":
          reauthenticateWithPopup(
            auth.currentUser,
            new FacebookAuthProvider()
          ).then(() => {
            if (innerProps.onSuccess) innerProps.onSuccess(); // Call the success callback
            context.closeModal(id);
          });
          break;
        default:
          throw new Error("Unsupported provider for reauthentication");
      }
      console.log("Reauthentication successful, about to call onAuthenticated");
    } catch (error: any) {
      console.error("Reauthentication failed:", error);
      setErrorMessage(error.message);
    }
  };

  const showEmailAndPasswordLogin = () => {
    return (
      <form>
        <TextInput
          className="mb-2"
          required
          label="Email"
          placeholder="johndoe123@gmail.com"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <PasswordInput
          className="my-2"
          required
          label="Password"
          placeholder="Your password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          radius="md"
        />
        <Center>
          <Text size="sm" color="red">
            {errorMessage}
          </Text>
        </Center>
        <Button
          className="my-2"
          variant="filled"
          onClick={handleReauthenticate}
          fullWidth
        >
          Login
        </Button>
      </form>
    );
  };
  
  const showGoogleLogin = () => {
    return (
      <>
        <GoogleButton radius="xl" onClick={handleReauthenticate} />
        <Text color="red" size="sm">
          {errorMessage}
        </Text>
      </>
    );
  };

  const showFacebookLogin = () => {
    return (
      <>
        <FacebookButton radius="xl" onClick={handleReauthenticate} />
        <Text color="red" size="sm">
          {errorMessage}
        </Text>
      </>
    );
  };

  return (
    <>
      {providerId === "password" && showEmailAndPasswordLogin()}
      {providerId === "google.com" && showGoogleLogin()}
      {providerId === "facebook.com" && showFacebookLogin()}
    </>
  );
};

export default ReauthenticateModal;
