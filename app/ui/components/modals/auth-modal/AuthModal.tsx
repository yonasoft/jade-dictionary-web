"use client";
import React, { useState } from "react";
import { modals } from "@mantine/modals";
import { Modal, Paper, Tabs, Text } from "@mantine/core";
import SignUpTab from "./SignUpTab";
import LoginTab from "./LoginTab";

type Props = {
  needSignUp: boolean;
};

const AuthModal = ({ needSignUp }: Props) => {
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
        {needSignUp ? <SignUpTab /> : <LoginTab />}
      </Tabs>
    </>
  );
};

export default AuthModal;
