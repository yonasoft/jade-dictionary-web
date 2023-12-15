"use client";
import { Accordion, Center, Divider, Title, Text } from "@mantine/core";
import React from "react";

type Props = {};

const FAQ = (props: Props) => {
  const buildAccordion = (
    items: Array<{ question: string; answer: string }>
  ) => {
    return (
      <Accordion>
        {items.map(({ question, answer }, index) => {
          return (
            <Accordion.Item key={index} value={question}>
              <Accordion.Control>
                <Text fw={700}>{question}</Text>
              </Accordion.Control>
              <Accordion.Panel>{answer}</Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    );
  };

  const account = [
    {
      question: "How do verify my account",
      answer:
        "An verification email will be sent to your email address when you sign up. You can also resend the verification email by clicking the 'Resend Verification Email' button the profile page by clicking the user menu on the right side of the navigation bar.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Click 'Login', then click 'Forgot Password?' An email will be sent to reset your password.",
    },
    {
      question: "How do I change my password?",
      answer:
        "Login, click the user menu on the right side of the navigation bar, then enter your new password and confirm. If the passwords are valid, it will be changed. You may be prompted to re-authenticate before changing the password.",
    },
    {
      question: "How do I change my display name?",
      answer:
        "Login and click the user menu on the right side of the navigation bar. Then press the pencil icon, enter your new display name, and press the check icon. Finally, press 'Save'.",
    },
    {
      question: "How do I change my profile picture?",
      answer:
        "Login and click the user menu on the right side of the navigation bar. Then upload your new profile picture. Finally, press 'Save'.",
    },
    {
      question: "How do I change my email?",
      answer:
        "Login, click the user menu on the right side of the navigation bar, then enter your new email and confirm. If the emails are valid, it will be changed. You may be prompted to re-authenticate before changing the email.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "Login, click the user menu on the right side of the navigation bar. Click the 'Delete Account' button and confirm by inputting 'Delete Account'. You may be prompted to re-authenticate first.",
    },
  ];

  return (
    <>
      <Center>
        <Title order={2}>FAQ</Title>
      </Center>
      <Divider my="lg" />
      <Center>
        <Title order={2}>Account</Title>
      </Center>
      {buildAccordion(account)}
      <Center>
        <Title order={2}>Dictionary</Title>
      </Center>
      <Center>
        <Title order={2}>Lists</Title>
      </Center>
      <Center>
        <Title order={2}>Practice</Title>
      </Center>
    </>
  );
};

export default FAQ;
