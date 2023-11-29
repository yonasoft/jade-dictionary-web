"use client";
import {
  Button,
  Center,
  Checkbox,
  Group,
  PasswordInput,
  TextInput,
  Text,
  Input,
} from "@mantine/core";
import React, { ServerContextJSONValue, useContext, useState } from "react";
import { useForm } from "@mantine/form";
import {
  FirebaseContext,
  useFirebaseContext,
} from "@/app/providers/FirebaseProvider";
import { modals, openContextModal } from "@mantine/modals";
import classes from "./AuthModal.module.css";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { send } from "process";
import { sendResetPassword } from "@/app/lib/firebase/authentication";

type Props = {};

const LoginTab = (props: Props) => {
  const firebase = useFirebaseContext();

  const [rememberMe, setRememberMe] = useState(false);
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
      // Set session persistence based on remember me checkbox
      const persistenceType = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;
      await setPersistence(firebase.auth, persistenceType);

      const result = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password
      );
      modals.closeAll();
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const openForgotPasswordModal = () => {
    openContextModal({
      modal: "resetPassword",
      title: "Reset Password",
      innerProps: {},
    });
  };

  return (
    <>
      <form>
        <TextInput
          type="email"
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
          type="password"
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
        <Checkbox
          className="my-1"
          label="Remember me"
          checked={rememberMe}
          onChange={(event) => setRememberMe(event.currentTarget.checked)}
        />
        <Button className="my-2" variant="filled" onClick={signIn} fullWidth>
          Login
        </Button>
        <Text color="green" size="sm" onClick={openForgotPasswordModal}>
          Forgot password?
        </Text>
      </form>
    </>
  );
};

export default LoginTab;
