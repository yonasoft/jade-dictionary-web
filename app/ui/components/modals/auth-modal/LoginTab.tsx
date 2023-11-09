"use client";
import { signInWithGoogle } from "@/app/lib/firebase/auth";
import { Button } from "@mantine/core";
import React from "react";
type Props = {};

const LoginTab = (props: Props) => {
  return (
    <div>
      <Button onClick={signInWithGoogle} />
    </div>
  );
};

export default LoginTab;
