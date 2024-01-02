import { Container } from "@mantine/core";
import React from "react";

const SupportLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container size="lg" aria-labelledby="support-page">
      {children}
    </Container>
  );
};

export default SupportLayout;
