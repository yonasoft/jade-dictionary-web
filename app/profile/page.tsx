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
import React, { useState } from "react";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import DisplayInformation from "./DisplayInformation";
import { useForm } from "@mantine/form";
import UserInformation from "./ProfileSettings";
import ProfileSettings from "./ProfileSettings";

type Props = {};

const Profile = (props: Props) => {
  const firebase = useFirebaseContext();

  if (!firebase.currentUser) {
    return <div></div>;
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
