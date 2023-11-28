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
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import { sendVerificationEmail } from "../lib/firebase/authentication";
import classes from "./page.module.css";
import Account from "./account-section/AccountSection";
import ProfileSection from "./profile-section/ProfileSection";
import AccountSection from "./account-section/AccountSection";

type Props = {};

const ProfilePage = (props: Props) => {
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
            className={`${classes.jadeButtons} my-2 mt-7`}
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
          </Button>
          <Text color="green">{verificationMessage}</Text>
        </Flex>
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
