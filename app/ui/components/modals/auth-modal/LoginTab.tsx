"use client";
import { signInWithGoogle } from "@/app/lib/firebase/authentication";
import { Button } from "@mantine/core";
import React from "react";
import classes from "./AuthModal.module.css";

type Props = {};

const LoginTab = (props: Props) => {
  return (
    <div>
      <Button className={classes.authButtons} onClick={signInWithGoogle} />
    </div>
  );
};

export default LoginTab;
