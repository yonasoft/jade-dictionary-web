"use client";
import { signOutUser } from "@/src/lib/firebase/authentication";
import { useFirebaseContext } from "@/src/providers/FirebaseProvider";
import { Avatar, Group, Menu, Text, rem } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronRight,
  IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect } from "react";

type Props = {
  shrink: boolean;
  onClose?: () => void;
};

const UserMenu = ({ shrink, onClose }: Props) => {
  const { currentUser, auth } = useFirebaseContext();

  useEffect(() => {}, [currentUser]);

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
      zIndex={50}
    >
      <Menu.Target>
        <div className="cursor-pointer">
          <Group className="bg-stone-100 rounded-xl" darkHidden>
            <Avatar
              src={currentUser?.photoURL || ""}
              alt="user profile picture"
              radius="xl"
            />
            <Text size="sm" visibleFrom={shrink ? "sm" : ""}>
              {trimStringWithEllipsis(
                currentUser?.displayName || currentUser?.email || "",
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
              src={currentUser?.photoURL || ""}
              alt="no image here"
              radius="xl"
            />
            <Text size="sm">
              {currentUser?.displayName || currentUser?.email}
            </Text>
            <IconChevronDown
              style={{ width: rem(14), height: rem(14) }}
              stroke={1.5}
            />
          </Group>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <Link href="/profile" passHref>
          <Menu.Item
            onClick={() => onClose?.()}
            rightSection={
              <IconChevronRight
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            <Group>
              <Avatar radius="xl" src={currentUser?.photoURL || ""} />
              <div>
                <Text fw={500}>{currentUser?.displayName}</Text>
                <Text size="xs" c="dimmed">
                  {currentUser?.email}
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
            signOutUser(auth);
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
