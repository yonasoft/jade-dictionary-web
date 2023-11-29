"use client";
import {
  signInWithFacebook,
  signInWithGoogle,
} from "@/app/lib/firebase/authentication";
import {
  FirebaseContext,
  useFirebaseContext,
} from "@/app/providers/FirebaseProvider";
import {
  Button,
  Center,
  Modal,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import {
  Auth,
  AuthCredential,
  EmailAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import React, { useState } from "react";
import { GoogleButton } from "../../buttons/GoogleButton";
import { FacebookButton } from "../../buttons/FacebookButton";

const ReauthenticateModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ onSuccess: () => void }>) => {
  const firebase = useFirebaseContext();
  const providerId: string =
    firebase.auth.currentUser!.providerData[0].providerId;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleReauthenticate = async () => {
    if (!firebase.auth.currentUser) {
      console.error("No user is currently signed in");
      return;
    }

    try {
      let credential;

      switch (providerId) {
        case "password":
          credential = EmailAuthProvider.credential(email, password);
          break;
        case "google.com":
          // Ensure this function returns a credential
          const googleResult = await signInWithGoogle(
            firebase.auth,
            firebase.firestore
          );
          credential = GoogleAuthProvider.credential(
            googleResult.credential.idToken
          );
          break;
        case "facebook.com":
          // Ensure this function returns a credential
          const fbResult = await signInWithFacebook(
            firebase.auth,
            firebase.firestore
          );
          credential = FacebookAuthProvider.credential(
            fbResult.credential.accessToken
          );
          break;
        default:
          throw new Error("Unsupported provider for reauthentication");
      }

      await reauthenticateWithCredential(
        firebase.auth.currentUser,
        credential
      ).then(() => {
        innerProps.onSuccess();
      });
      console.log("Reauthentication successful, about to call onAuthenticated");
      context.closeModal(id);
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
        <GoogleButton radius="xl" />
        <Text color="red" size="sm">
          {errorMessage}
        </Text>
      </>
    );
  };
  const showFacebookLogin = () => {
    return (
      <>
        <FacebookButton radius="xl" />
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
