"use client";
import React, {  } from "react";
import {
  Flex,
  rem,
  Text,
  Input,
} from "@mantine/core";
import {
  IconCheck,
  IconPencil,
  IconX,
} from "@tabler/icons-react";

type Props = {
  editDisplayName: boolean;
  setEditDisplayName: (editDisplayName: boolean) => void;
  displayName: string;
  setDisplayName: (displayName: string) => void;
  currentUser: any;
};

export const DisplayNameInput = ({
  editDisplayName,
  setEditDisplayName,
  displayName,
  setDisplayName,
  currentUser,
}: Props) => {
  return (
    <Input.Wrapper label="Display Name" fw={400}>
      {editDisplayName ? (
        <Flex justify="center" align="center" direction="row">
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.currentTarget.value)}
          />
          <IconCheck
            className="mx-2"
            onClick={() => {
              setEditDisplayName(false);
            }}
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
            color="green"
          />
          <IconX
            className="mx-2"
            onClick={() => {
              setDisplayName(currentUser?.displayName as string);
              setEditDisplayName(false);
            }}
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
            color="red"
          />
        </Flex>
      ) : (
        <Flex justify="center" align="center" direction="row">
          <Text>{displayName || currentUser?.displayName}</Text>

          <IconPencil
            className="mx-2"
            onClick={() => setEditDisplayName(true)}
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        </Flex>
      )}
    </Input.Wrapper>
  );
};
