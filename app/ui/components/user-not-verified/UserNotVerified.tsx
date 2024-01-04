"use client";
import { sendVerificationEmail } from "@/app/lib/firebase/authentication";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { Flex, Button, Text } from "@mantine/core";
import React, { useState } from "react";

type Props = {};

const UserNotVerified = (props: Props) => {
  const { auth } = useFirebaseContext();
  const [verificationMessage, setVerificationMessage] = useState("");

  return (
    <Flex className="mt-15" direction="column" justify="center" align="center">
      <Text size="lg">
        Please verify your email before accessing your profile.
      </Text>
      <Button
        className={`my-2 mt-7`}
        onClick={() => {
          setVerificationMessage("");
          sendVerificationEmail(auth)
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
  );
};

export default UserNotVerified;
