"user client";

import React from "react";
import { Button } from "@mantine/core";


type Props = {};

function AuthButtons({}: Props) {
  return (
    <>
      <Button variant="outline" size="xs" radius="lg">
        Login
      </Button>
      <Button variant="filled" size="xs" radius="lg">
        Sign Up
      </Button>
    </>
  );
}

export default AuthButtons;
