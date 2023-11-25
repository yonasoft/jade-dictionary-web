"use client";
import {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  rem,
  Text,
  Image,
  Center,
  FileInput,
  Input,
  Button,
} from "@mantine/core";
import { IconPencil, IconUpload, IconUserCircle } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import DisplayInformation from "./DisplayInformation";
import { useForm } from "@mantine/form";
import UserInformation from "./ProfileSettings";
import ProfileSettings from "./ProfileSettings";
import { sendVerificationEmail } from "../lib/firebase/authentication";

type Props = {};

const Profile = (props: Props) => {
  const firebase = useFirebaseContext();
  const [verificationMessage, setVerificationMessage] = useState("");

  useEffect(() => {}, [firebase.auth]);

  if (!firebase.currentUser) {
    return <div></div>;
  }

  if (!firebase.currentUser.emailVerified) {
    return (
      <Container size="lg">
        <Flex
          className="mt-15"
          direction="column"
          justify="center"
          align="center"
        >
          <Text size="lg">
            Please verify your email before accessing your profile.
          </Text>
          <Button
            className="mt-7"
            color="#459d57"
            onClick={() => {
              setVerificationMessage("");
              sendVerificationEmail(firebase.auth)
                .then(() => {
                  setVerificationMessage("Verification Sent Successfully!");
                })
                .catch((e) => {
                  console.log(e);
                  setVerificationMessage("Error sending verification");
                });
            }}
          >
            Resend Verification Link
          </Button >
          <Text color="green">{verificationMessage}</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Card shadow="sm" padding="sm" radius="md" withBorder>
        <Group justify="flex-start">
          <IconUserCircle
            style={{ width: rem(30), height: rem(30) }}
            stroke={1.5}
            color="gray"
          />
          <Text size="md">Profile</Text>
        </Group>
        <Grid grow>
          <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
            <DisplayInformation />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 8, md: 9 }}>
            <ProfileSettings />
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
};

export default Profile;
