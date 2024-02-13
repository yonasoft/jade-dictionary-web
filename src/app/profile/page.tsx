"use client";
import { Container, Center, Space, Title } from "@mantine/core";
import React, { useEffect } from "react";
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
