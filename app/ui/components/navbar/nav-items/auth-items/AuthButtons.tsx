"user client";

import React from "react";
import { Button } from "@mantine/core";

import classes from "./AuthButtons.module.css";

type Props = {};

function AuthButtons({}: Props) {
  return (
    <>
      <Button variant="outline" size="xs" radius="lg">
        Login
      </Button>
      <Button
        className={classes.signUpButton}
        variant="filled"
        size="xs"
        radius="lg"
      >
        Sign Up
      </Button>
    </>
  );
}

export default AuthButtons;
