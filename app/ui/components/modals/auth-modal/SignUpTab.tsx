"use client";

import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { Button, Center, PasswordInput, TextInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import React, { useState } from "react";
import classes from "./AuthModal.module.css";

type Props = {};

const SignUpTab = (props: Props) => {
  const firebase = useFirebaseContext();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters long" : null,
      passwordConfirmation: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });
  const [errorMessage, setErrorMessage] = useState("");

  const signUp = async () => {
    const { email, password, passwordConfirmation } = form.values;

    // Basic validation
    if (!email || !password || !passwordConfirmation) {
      setErrorMessage(
        "Email, password, and confirmation password are required"
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters long");
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Email format validation (simple example)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format");
      return;
    }

    try {
      const result = await firebase.handleCreateUserEmailPassword(email, password);
      modals.closeAll();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <form className="pa-2">
        <TextInput
          required
          label="Email"
          placeholder="johndoe123@gmail.com"
          value={form.values.email}
          onChange={(event) =>
            form.setFieldValue("email", event.currentTarget.value)
          }
          error={form.errors.email && "Invalid email"}
          radius="md"
        />

        <PasswordInput
          required
          label="Password"
          placeholder="Your password"
          value={form.values.password}
          onChange={(event) =>
            form.setFieldValue("password", event.currentTarget.value)
          }
          error={form.errors.password}
          radius="md"
        />
        <PasswordInput
          required
          label="Confirm Password"
          placeholder="Confirm your password"
          value={form.values.passwordConfirmation}
          onChange={(event) =>
            form.setFieldValue(
              "passwordConfirmation",
              event.currentTarget.value
            )
          }
          error={form.errors.confirmPassword}
          radius="md"
        />
        <Center>
          <Text size="sm" color="red">
            {errorMessage}
          </Text>
        </Center>
        <Button
          className={`${classes.jadeButtons} my-2`}
          onClick={signUp}
          fullWidth
        >
          Sign Up
        </Button>
      </form>
    </>
  );
};

export default SignUpTab;
