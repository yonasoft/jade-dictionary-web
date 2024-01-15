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
  Space,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import classes from "./page.module.css";
import Account from "./account-section/AccountSection";
import ProfileSection from "./profile-section/ProfileSection";
import AccountSection from "./account-section/AccountSection";
import UserNotVerified from "@/src/components/user-not-verified/UserNotVerified";
import { useFirebaseContext } from "@/src/providers/FirebaseProvider";


type Props = {};

const ProfilePage = (props: Props) => {
  const { auth, currentUser } = useFirebaseContext();

  useEffect(() => {}, [auth]);

  if (!currentUser) {
    return (
      <Container size="lg">
        <Center>
          <Title order={1}>No User Logged in</Title>
        </Center>
      </Container>
    );
  }

  if (!currentUser.emailVerified) {
    return (
      <Container size="lg">
        <UserNotVerified />
      </Container>
    );
  }

  return (
    <Container size="lg">
      <ProfileSection />
      <Space h="lg" />
      <AccountSection />
    </Container>
  );
};

export default ProfilePage;
