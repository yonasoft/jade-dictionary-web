"use client";
import { signOutUser } from "@/app/lib/firebase/authentication";
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
import Link from "next/link";
import React, { useContext, useEffect } from "react";

type Props = {};

const UserMenu = (props: Props) => {
  const firebase = useFirebaseContext();

  useEffect(() => {}, [firebase.currentUser]);

  const trimStringWithEllipsis = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
  };

  return (
    <Menu
      shadow="md"
      transitionProps={{ transition: "pop" }}
      withArrow
      zIndex={3000}
    >
      <Menu.Target>
        <div className="cursor-pointer">
          <Group className="bg-stone-100 rounded-xl" darkHidden>
            <Avatar
              src={firebase.currentUser?.photoURL || ""}
              alt="user profile picture"
              radius="xl"
            />
            <Text size="sm">
              {trimStringWithEllipsis(
                firebase.currentUser?.displayName ||
                  firebase.currentUser?.email ||
                  "",
                15
              )}
            </Text>
            <IconChevronDown
              style={{ width: rem(14), height: rem(14) }}
              stroke={1.5}
            />
          </Group>
          <Group className="bg-stone-800 rounded-xl" lightHidden>
            <Avatar
              src={firebase.currentUser?.photoURL || ""}
              alt="no image here"
              radius="xl"
            />
            <Text size="sm">
              {firebase.currentUser?.displayName || firebase.currentUser?.email}
            </Text>
            <IconChevronDown
              style={{ width: rem(14), height: rem(14) }}
              stroke={1.5}
            />
          </Group>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <Link href="/profile">
          <Menu.Item
            rightSection={
              <IconChevronRight
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            <Group>
              <Avatar radius="xl" src={firebase.currentUser?.photoURL || ""} />
              <div>
                <Text fw={500}>{firebase.currentUser?.displayName}</Text>
                <Text size="xs" c="dimmed">
                  {firebase.currentUser?.email}
                </Text>
              </div>
            </Group>
          </Menu.Item>
        </Link>

        <Menu.Item
          leftSection={
            <IconLogout
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          onClick={() => {
            signOutUser(firebase.auth);
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
