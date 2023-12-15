import {
  Anchor,
  Avatar,
  Center,
  Divider,
  Flex,
  Group,
  Space,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import React from "react";

type Props = {};

const About = (props: Props) => {
  return (
    <>
      <Center>
        <Title>About</Title>
      </Center>
      <Divider my="lg" />
      <Flex
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        gap="md"
      >
        <Title order={2}>Story</Title>

        <Avatar size="xl" alt="picture of Yonasoft" />

        <Text>
          &emsp;&emsp;Hello, I am Yonasoft. My passion lies in merging Software
          Engineering with my varied interests and hobbies. While learning
          Mandarin to connect with my family in China for future visits, I was
          inspired to develop a Chinese-English dictionary application. This app
          features a comprehensive dictionary, lists for word storage and
          organization, and practice modules to aid memorization. It's crucial
          to use these words in real-life contexts as well to retain them and
          achieve fluency in speaking. My goal was to create an easy-to-use,
          user-friendly interface. I hope you find it helpful and enjoyable!
        </Text>

        <Space h="lg" />

        <Title order={2}>Technologies & Resources Used</Title>
        <Text>
          <Anchor
            href="https://www.mdbg.net/chinese/dictionary?page=cedict"
            target="_blank"
          >
            CC-CEDICT
          </Anchor>
          &nbsp;- For Chinese word data and parser to convert to SQlite.
        </Text>
        <Text>
          <Anchor href="https://firebase.google.com/" target="_blank">
            Firebase
          </Anchor>
          &nbsp;- For authentication and storage.
        </Text>
        <Text>
          <Anchor href="https://nextjs.org/" target="_blank">
            NextJS
          </Anchor>
          /
          <Anchor href="https://react.dev/" target="_blank">
            ReactJS
          </Anchor>
          &nbsp;
          <Anchor href="https://tailwindcss.com/" target="_blank">
            Tailwind CSS
          </Anchor>
          &nbsp;
          <Anchor href="https://mantine.dev/" target="_blank">
            Mantine
          </Anchor>
          &nbsp;- for frontend UI.
        </Text>
        <Text>
          <Anchor href="https://www.emailjs.com/" target="_blank">
            EmailJS
          </Anchor>
          &nbsp;- for email contact form.
        </Text>

        <Space h="lg" />

        <Title order={2}>Other Projects</Title>
        <Text>
          <Anchor href="https://www.anitier.com/" target="_blank">
            Anitier
          </Anchor>
          &nbsp; - Anime tier list maker.
        </Text>
        <Text>
          <Anchor
            href="https://play.google.com/store/apps/details?id=com.yonasoft.handballcourtmanager"
            target="_blank"
          >
            Handball Court Manager
          </Anchor>
          &nbsp; - Handball court score and queue tracker.
        </Text>
      </Flex>
    </>
  );
};

export default About;
