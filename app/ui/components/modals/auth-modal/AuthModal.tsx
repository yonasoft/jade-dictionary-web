"use client";
import React, { useState } from "react";
import { Button, Divider, Tabs, Text } from "@mantine/core";
import SignUpTab from "./SignUpTab";
import LoginTab from "./LoginTab";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";

type Props = {
  needSignUp: boolean;
};

const AuthModal = ({ needSignUp }: Props) => {
  const firebase = useFirebaseContext();
  const [isSignUp, setIsSignUp] = useState(needSignUp);

  return (
    <>
      <Tabs
        defaultValue={needSignUp ? "signup" : "login"}
        z-index={2000}
        onChange={() => {
          setIsSignUp(!isSignUp);
        }}
      >
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
        {isSignUp ? <SignUpTab /> : <LoginTab />}
      </Tabs>
      <Divider my="xs" label="Sign in with..." labelPosition="center" />
      <Button className="py-2" fullWidth></Button>
      <Button className="py-2" fullWidth></Button>
    </>
  );
};

export default AuthModal;
