"use client";
import { Accordion, Center, Divider, Title, Text, Space } from "@mantine/core";
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
      question: "How do I verify my account?",
      answer:
        "A verification email will be sent to your email address when you sign up. You can also resend the verification email by clicking the 'Resend Verification Email' button on the profile page, accessible via the user menu on the right side of the navigation bar.",
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

  const dictionary = [
    {
      question: "How do I search for a word?",
      answer:
        "You can search for words via the home page or using the search bar in the navigation bar. The search bar can be quickly accessed by pressing Ctrl+K.",
    },
    {
      question: "What inputs can I use to search for a word?",
      answer:
        "Searches can be conducted using Chinese characters, pinyin, or English. For pinyin searches, it's recommended to use tone numbers, although tone marks are also acceptable. Adding spaces between each syllable in pinyin searches is advised for more accurate results.",
    },
    {
      question: "How are the search results sorted?",
      answer:
        "Search results are sorted based on the closest match to your query input. This may sometimes include words that are obscure or less commonly used.",
    },
  ];

  const lists = [
    {
      question: "How do I create a list?",
      answer:
        "Go to the lists page and press 'Add New List' card. Add a title and an optional description and press 'Create'. Note that you must be logged in to create word lists",
    },
    {
      question: "How do I add words to a list?",
      answer:
        "Search for words in the search bar or home page, and press the '+' button to add it to a list of your choice. You must be logged in and ahve actice word lists to add words to a list.",
    },
    {
      question: "How do I remove a word list?",
      answer:
        "Go to the lists and press the '...' button on the list card and press 'Remove'.",
    },
    {
      question: "How do I remove a word from a word list?",
      answer:
        "Go to the lists, select the list of your choice and press the '...' button on the list card and press 'Remove'.",
    },
  ];

  const practice = [{ question: "How do I practice?", answer: "" }];

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
      <Space my="sm" />
      <Center>
        <Title order={2}>Dictionary</Title>
      </Center>

      {buildAccordion(dictionary)}
      <Space my="sm" />

      <Center>
        <Title order={2}>Lists</Title>
      </Center>

      {buildAccordion(lists)}
      <Space my="sm" />

      <Center>
        <Title order={2}>Practice</Title>
      </Center>
      {buildAccordion(practice)}
    </>
  );
};

export default FAQ;
