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
} from "@mantine/core";
import { IconUserCircle } from "@tabler/icons-react";
import React from "react";
import { useFirebaseContext } from "../providers/FirebaseProvider";

type Props = {};

const Profile = (props: Props) => {
  const firebase = useFirebaseContext();

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
              size="xs"
              style={{ width: rem(30), height: rem(30) }}
              stroke={1.5}
              color="gray"
            />
            <Text size="md">Profile</Text>
          </Group>
          <Grid className="py-3">
            <Grid.Col span={{ base: 12, sm: 3, md: 4 }}>xd</Grid.Col>
            <Grid.Col span={{ base: 12, sm: 9, md: 8 }}>
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
