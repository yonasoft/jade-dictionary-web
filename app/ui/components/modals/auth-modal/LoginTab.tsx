"use client";
import {
  Button,
  Center,
  Checkbox,
  Group,
  PasswordInput,
  TextInput,
  Text,
} from "@mantine/core";
import React, { ServerContextJSONValue, useContext, useState } from "react";
import { useForm } from "@mantine/form";
import {
  FirebaseContext,
  useFirebaseContext,
} from "@/app/providers/FirebaseProvider";
import { modals } from "@mantine/modals";
import classes from "./AuthModal.module.css";

type Props = {};

const LoginTab = (props: Props) => {
  const firebase = useFirebaseContext();
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const signIn = async () => {
    const { email, password } = form.values;

    try {
      const result = await firebase.signInWithEmailPassword(email, password);
      modals.closeAll();
      if (result.error) {
        setErrorMessage(
          "The email and password you entered did not match our records. Please double-check and try again."
        );
      } else {
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <>
      <form>
        <TextInput
          className="mb-2"
          required
          label="Email"
          placeholder="johndoe123@gmail.com"
          value={form.values.email}
          onChange={(event) =>
            form.setFieldValue("email", event.currentTarget.value)
          }
        />
        <PasswordInput
          className="my-2"
          required
          label="Password"
          placeholder="Your password"
          value={form.values.password}
          onChange={(event) =>
            form.setFieldValue("password", event.currentTarget.value)
          }
          radius="md"
        />
        <Center>
          <Text size="sm" color="red">
            {errorMessage}
          </Text>
        </Center>
        <Checkbox className="jadeCheckbox my-1" label="Remember me" />
        <Button
          className={`${classes.jadeButtons} my-2`}
          onClick={signIn}
          fullWidth
        >
          Login
        </Button>
      </form>
    </>
  );
};

export default LoginTab;
