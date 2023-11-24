"use client";
import { Button, Card, Center, Grid, Input, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import {
  reauthenticate,
  updateUserEmail,
  updateUserPassword,
} from "../lib/firebase/authentication";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import { checkEmailExists } from "../lib/firebase/storage";
import {
  AuthCredential,
  User,
  reauthenticateWithCredential,
} from "firebase/auth";
import classes from "./page.module.css";

type Props = {};

const ProfileSettings = (props: Props) => {
  const firebase = useFirebaseContext();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const form = useForm({
    initialValues: {
      email: "",
      emailConfirmation: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const validateEmail = async () => {
    const { email, emailConfirmation } = form.values;
    setEmailError(""); // Reset email error

    if (email !== emailConfirmation) {
      setEmailError("Emails do not match.");
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      return false;
    }

    if (email === firebase.currentUser?.email) {
      setEmailError("Email is the same as current email.");
      return false;
    }

    const emailExists = await checkEmailExists(firebase.db, email);
    if (emailExists) {
      setEmailError("Email already in use. Please use a different email.");
      return false;
    }

    setWarningMessage(
      `Check your email (${email.toUpperCase}) for a verification link. You will be logged out after changing your email.`
    );
    return true;
  };

  const validatePassword = () => {
    const { password, passwordConfirmation } = form.values;
    setPasswordError(""); 

    if (password !== passwordConfirmation) {
      setPasswordError("Passwords do not match.");
      return false;
    }

    if (password.length < 10 || !/\d/.test(password)) {
      setPasswordError(
        "Password must be at least 10 characters long and include numbers."
      );
      return false;
    }

    return true;
  };

  const updateInformation = async () => {
    setEmailError("");
    setPasswordError("");
    setSuccessMessage("");
    setWarningMessage("");

    let isEmailValid = true;
    let isPasswordValid = true;

    if (form.values.email) {
      isEmailValid = await validateEmail();
      if (isEmailValid && form.values.email !== firebase.currentUser?.email) {
        await updateUserEmail(firebase.auth, form.values.email);
        setWarningMessage(
          `Check your email (${form.values.email.toUpperCase()}) for a verification link.`
        );
      }
    }

    // Validate and update password only if the password field is filled
    if (form.values.password) {
      isPasswordValid = validatePassword();
      if (isPasswordValid) {
        await updateUserPassword(firebase.auth, form.values.password);
      }
    }

    if (isEmailValid && isPasswordValid) {
      setSuccessMessage("Successfully updated information.");
    }
  };

  return (
    <>
      <Card className="h-full" shadow="md" radius="md">
        {emailError && (
          <Text color="red" size="sm">
            {emailError}
          </Text>
        )}
        {passwordError && (
          <Text color="red" size="sm">
            {passwordError}
          </Text>
        )}
        {successMessage && (
          <Text color="green" size="sm">
            {successMessage}
          </Text>
        )}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Input.Wrapper label="E-mail" fw={400}>
              <Input
                value={form.values.email}
                onChange={(e) =>
                  form.setFieldValue("email", e.currentTarget.value)
                }
              />
            </Input.Wrapper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Input.Wrapper label="Confirm E-mail" fw={400}>
              <Input
                value={form.values.emailConfirmation}
                onChange={(e) =>
                  form.setFieldValue("emailConfirmation", e.currentTarget.value)
                }
              />
            </Input.Wrapper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Input.Wrapper label="Password" fw={400}>
              <Input
                value={form.values.password}
                onChange={(e) =>
                  form.setFieldValue("password", e.currentTarget.value)
                }
              />
            </Input.Wrapper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            {" "}
            <Input.Wrapper label="Password Confirmation" fw={400}>
              <Input
                value={form.values.passwordConfirmation}
                onChange={(e) =>
                  form.setFieldValue(
                    "passwordConfirmation",
                    e.currentTarget.value
                  )
                }
              />
            </Input.Wrapper>
          </Grid.Col>
        </Grid>
        <Center className="mt-auto">
          <Button
            className={`${classes.jadeButtons} mt-3 w-fit`}
            onClick={updateInformation}
          >
            Save
          </Button>
        </Center>
      </Card>
    </>
  );
};

export default ProfileSettings;
