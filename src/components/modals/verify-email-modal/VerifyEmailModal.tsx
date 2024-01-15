import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import classes from "./VerifyEmailModal.module.css";
import React from "react";

type Props = {
  email: string;
};

const VerifyEmailModal = ({ email }: Props) => {
  return (
    <>
      <p>
        We sent a verification email to <strong>{email}</strong>. Please click
        the link in that email to verify your account.
      </p>
      <Button
        className={`${classes.jadeButtons}`}
        onClick={() => {
          modals.closeAll();
        }}
      >
        Close
      </Button>
    </>
  );
};

export default VerifyEmailModal;
