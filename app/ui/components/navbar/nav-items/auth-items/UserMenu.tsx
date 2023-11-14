"use client";
import {
  FirebaseContext,
  useFirebaseContext,
} from "@/app/providers/FirebaseProvider";
import { ActionIcon, Avatar, Group, Menu, Text, rem } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronRight,
  IconDots,
  IconLogout,
  IconUser,
  IconUserCircle,
} from "@tabler/icons-react";
import React, { useContext } from "react";

type Props = {};

const UserMenu = (props: Props) => {
  const firebase = useFirebaseContext();

  return (
    <>
      <Menu
        transitionProps={{ transition: "pop" }}
        withArrow
        position="bottom-end"
        withinPortal
        zIndex={2000}
      >
        <Menu.Target>
          <Group className="bg-slate-100 rounded-xl">
            <Avatar src={null} alt="no image here" radius="xl" />
            <Text size="sm">
              {firebase.currentUser?.displayName || firebase.currentUser?.email}
            </Text>
            <IconChevronDown
              style={{ width: rem(14), height: rem(14) }}
              stroke={1.5}
            />
          </Group>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            rightSection={
              <IconChevronRight
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            <Group>
              <Avatar radius="xl" src="" />

              <div>
                <Text fw={500}>{firebase.currentUser?.displayName}</Text>
                <Text size="xs" c="dimmed">
                  {firebase.currentUser?.email}
                </Text>
              </div>
            </Group>
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconLogout
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            onClick={firebase.signOut}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default UserMenu;
