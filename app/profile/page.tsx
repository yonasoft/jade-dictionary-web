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
} from "@mantine/core";
import { IconPencil, IconUpload, IconUserCircle } from "@tabler/icons-react";
import React, { useState } from "react";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import DisplayInformation from "./DisplayInformation";

type Props = {};

const Profile = (props: Props) => {
  return (
    <>
      <Container size="lg">
        <Card
          className="profile"
          shadow="sm"
          padding="sm"
          radius="md"
          withBorder
        >
          <Group justify="flex-start">
            <IconUserCircle
              style={{ width: rem(30), height: rem(30) }}
              stroke={1.5}
              color="gray"
            />
            <Text size="md">Profile</Text>
          </Group>
          <Grid className="py-3">
            <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
              <DisplayInformation />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 8, md: 9 }}>
              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>lol</Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>lol2</Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>lol3</Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>lol4</Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>lol5</Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>
        </Card>
      </Container>
    </>
  );
};

export default Profile;
