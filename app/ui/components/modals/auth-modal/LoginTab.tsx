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

  return (
    <>
      <form onSubmit={form.onSubmit(() => {})}>
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
        <Button className="jadeButtons my-2" fullWidth onClick={() => {}}>
          Login
        </Button>
      </form>
    </>
  );
};

export default LoginTab;
