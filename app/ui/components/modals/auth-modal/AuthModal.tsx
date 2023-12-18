"use client";
import React, { useState } from "react";
import { Button, Divider, Tabs, Text } from "@mantine/core";
import SignUpTab from "./SignUpTab";
import LoginTab from "./LoginTab";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { GoogleButton } from "../../auth-items/GoogleButton";
import { FacebookButton } from "../../auth-items/FacebookButton";
import {
  signInWithFacebook,
  signInWithGoogle,
} from "@/app/lib/firebase/authentication";
import { modals } from "@mantine/modals";

type Props = {
  needSignUp: boolean;
};

const AuthModal = ({ needSignUp }: Props) => {
  const firebase = useFirebaseContext();

  const [activeTab, setActiveTab] = useState<string | null>(
    needSignUp ? "signup" : "login"
  );

  return (
    <>
      <Tabs value={activeTab} z-index={2000} onChange={setActiveTab}>
        <Tabs.Panel value="login" pb="xs">
          <Text size="lg" fw={400}>
            Login
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="signup" pb="xs">
          <Text size="lg" fw={400}>
            Sign Up
          </Text>
        </Tabs.Panel>
        <Tabs.List grow>
          <Tabs.Tab value="login">Login</Tabs.Tab>
          <Tabs.Tab value="signup">Sign Up</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="login">
          <LoginTab />
        </Tabs.Panel>
        <Tabs.Panel value="signup">
          <SignUpTab />
        </Tabs.Panel>
      </Tabs>
      <Divider my="xs" label="Sign in with..." labelPosition="center" />
      <GoogleButton
        radius="xl"
        onClick={() => {
          signInWithGoogle(firebase.auth, firebase.firestore);
          modals.closeAll();
        }}
      >
        Google
      </GoogleButton>
      {/* <FacebookButton
        radius="xl"
        onClick={() => {
          signInWithFacebook(firebase.auth, firebase.firestore);
          modals.closeAll();
        }}
      >
        Facebook
      </FacebookButton> */}
    </>
  );
};

export default AuthModal;
