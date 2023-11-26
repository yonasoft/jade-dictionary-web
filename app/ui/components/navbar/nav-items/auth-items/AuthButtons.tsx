import React, { useState } from "react";
import { Button } from "@mantine/core";
import classes from "./AuthItems.module.css";
import { modals } from "@mantine/modals";
import AuthModal from "../../../modals/auth-modal/AuthModal";

type Props = {
  additionalOnClick?: () => void;
};

function AuthButtons({ additionalOnClick }: Props) {
  const openModal = (needSignUp: boolean) => {
    additionalOnClick?.();
    modals.open({
      title: "Welcome to Jade Dictionary!",
      children: <AuthModal needSignUp={needSignUp} />,
    });
  };

  const Signup = () => {
    openModal(true);
  };

  const Login = () => {
    openModal(false);
  };

  return (
    <>
      <Button variant="outline" size="xs" radius="lg" onClick={Login}>
        Login
      </Button>
      <Button variant="filled" size="xs" radius="lg" onClick={Signup}>
        Sign Up
      </Button>
    </>
  );
}

export default AuthButtons;
