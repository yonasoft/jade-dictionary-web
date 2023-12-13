import React from "react";
import { Text, Button, Container, Anchor, Title, Center } from "@mantine/core";

const Donate = () => {
  return (
    <>
      <Center>
        <Title>谢谢！</Title>
      </Center>
      <div className="flex flex-col items-center justify-center">
        <Text size="lg" className="mb-4 text-center">
          Enjoying Jade and want to support us? Consider donating!
        </Text>
        <Button
          variant="filled"
          component="a"
          href="https://www.buymeacoffee.com/yonasoft"
          target="_blank"
          className="mb-4"
        >
          Buy Me A Coffee
        </Button>

        <Button
          variant="filled"
          component="a"
          href="https://ko-fi.com/yonasoft"
          target="_blank"
          className="mb-4"
        >
          Ko-Fi
        </Button>
      </div>
    </>
  );
};

export default Donate;
