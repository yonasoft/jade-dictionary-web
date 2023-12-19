import { Container } from "@mantine/core";
import React from "react";

const PracticeLayout = ({ children }: { children: React.ReactNode }) => {
  return <Container size="lg">{children}</Container>;
};

export default PracticeLayout;
