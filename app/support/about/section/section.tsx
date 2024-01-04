import { Center, Title, Flex } from "@mantine/core";
import { ReactNode } from "react";

type Props = {
  title: string,
  children: ReactNode,
};

export const Section = ({ title, children }:Props) => (
  <section aria-labelledby={title.replace(/\s+/g, "-").toLowerCase()}>
    <Center>
      <Title order={2}>{title}</Title>
    </Center>
    <Flex
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
      gap="md"
    >
      {children}
    </Flex>
  </section>
);
