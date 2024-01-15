import { Accordion, Text } from "@mantine/core";

export const FAQAccordion = ({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) => {
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
