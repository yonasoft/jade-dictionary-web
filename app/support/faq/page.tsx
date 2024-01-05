"use client";
import { account, dictionary, lists, practice } from "@/app/lib/constants/faq";
import { Center, Divider, Title, Space } from "@mantine/core";
import React from "react";
import { FAQAccordion } from "./FAQAccordian";

type Props = {};

const FAQ = (props: Props) => {
  return (
    <div aria-labelledby="FAQ">
      <Center>
        <Title order={2}>FAQ</Title>
      </Center>

      <Divider my="lg" />

      <section aria-labelledby="account-FAQ">
        <Center>
          <Title order={2}>Account</Title>
        </Center>
        <FAQAccordion items={account} />
      </section>

      <Space my="sm" />

      <section aria-labelledby="dictionary-FAQ">
        <Center>
          <Title order={2}>Dictionary</Title>
        </Center>
        <FAQAccordion items={dictionary} />
      </section>

      <Space my="sm" />

      <section aria-labelledby="lists-FAQ">
        <Center>
          <Title order={2}>Lists</Title>
        </Center>

        <FAQAccordion items={lists} />
      </section>

      <Space my="sm" />

      <section aria-labelledby="practice-FAQ">
        <Center>
          <Title order={2}>Practice</Title>
        </Center>
        <FAQAccordion items={practice} />
      </section>
    </div>
  );
};

export default FAQ;
