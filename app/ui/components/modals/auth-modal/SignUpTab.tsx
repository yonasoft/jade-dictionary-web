"use client";

import { PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";

type Props = {};

const SignUpTab = (props: Props) => {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  return (
    <>
      <form className="pa-2" onSubmit={form.onSubmit(() => {})}>
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
          error={
            form.errors.password &&
            "Password should include at least 6 characters"
          }
          radius="md"
        />
        <PasswordInput
          required
          label="Confirm Password"
          placeholder="Confirm your password"
          value={form.values.passwordConfirmation}
          onChange={(event) =>
            form.setFieldValue("password", event.currentTarget.value)
          }
          error={
            form.errors.password &&
            "Password should include at least 6 characters"
          }
          radius="md"
        />
      </form>
    </>
  );
};

export default SignUpTab;
