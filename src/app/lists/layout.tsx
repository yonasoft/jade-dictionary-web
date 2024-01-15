
import { Container } from "@mantine/core";
import React from "react";

const ListsLayout = ({ children }: { children: React.ReactNode }) => {
  return <Container size="lg">{children}</Container>;
};

export default ListsLayout;
