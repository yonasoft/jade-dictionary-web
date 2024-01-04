"use client";
import {
  Button,
  Card,
  Center,
  Grid,
  Input,
  PasswordInput,
  Text,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useProfileForm } from "@/app/hooks/useProfileForm";

type Props = {};

const ProfileSettings = (props: Props) => {
  const {
    form,
    emailError,
    passwordError,
    errorMessage,
    successMessage,
    updateInformation,
    isModalClosed,
    setIsModalClosed,
    warningMessage,
  } = useProfileForm();

  useEffect(() => {
    if (isModalClosed) {
      updateInformation();
      setIsModalClosed(false); // Reset the state
    }
  }, [isModalClosed]);

  return (
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
      {errorMessage && (
        <Text color="red" size="sm">
          {errorMessage}
        </Text>
      )}
      {successMessage && (
        <Text color="green" size="sm">
          {successMessage}
        </Text>
      )}
      {warningMessage && (
        <Text color="yellow" size="sm">
          {warningMessage}
        </Text>
      )}
      <Grid grow>
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
            <PasswordInput
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
            <PasswordInput
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
          className="mt-3 w-fit"
          variant="filled"
          onClick={updateInformation}
        >
          Save
        </Button>
      </Center>
    </Card>
  );
};

export default ProfileSettings;
