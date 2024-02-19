import {
  Anchor,
  Center,
  Divider,
  Flex,
  Space,
  Text,
  Title,
} from "@mantine/core";
import React from "react";
import { Section } from "./section/section";

type Props = {};

const About = (props: Props) => {
  return (
    <>
      <Center>
        <Title order={1}>About</Title>
      </Center>
      <Divider my="lg" />

      <Section title="Story">
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
      </Section>

      <Space h="md" />

      <Section title="Technologies & Resources Used">
        <Flex
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          gap="md"
        >
          <Text>
            <Anchor
              href="https://www.mdbg.net/chinese/dictionary?page=cedict"
              target="_blank"
            >
              CC-CEDICT
            </Anchor>
            &nbsp;- For Chinese word data and parser to convert the file.
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
            &nbsp;,&nbsp;
            <Anchor href="https://tailwindcss.com/" target="_blank">
              Tailwind CSS
            </Anchor>
            &nbsp;,&nbsp;
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
          <Text>
            <Anchor href="https://virtual-keyboard.js.org/" target="_blank">
              Simple Keyboard
            </Anchor>
            &nbsp;- for Chinese character input.
          </Text>
          <Text>
            <Anchor
              href="https://github.com/gugray/HanziLookupJS"
              target="_blank"
            >
              HanziLookupJS
            </Anchor>
            &nbsp;- for Chinesehand writing input.
          </Text>
        </Flex>
      </Section>

      <Space h="md" />

      <Section title="Other Projects">
        <Flex
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          gap="md"
        >
          <Text>
            <Anchor href="https://www.anitier.com/" target="_blank">
              AniTier
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
      </Section>
    </>
  );
};

export default About;
