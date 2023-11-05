"use client";
import React from "react";
import {
  Group,
  Burger,
  Container,
  Drawer,
  ScrollArea,
  RemoveScroll,
  NavLink,
  ActionIcon,
  Flex,
} from "@mantine/core";
import classes from "./Navbar.module.css";
import MenuItem from "./MenuItem";
import { useDisclosure } from "@mantine/hooks";
import JadeLogo from "../JadeLogo";
import UserMenu from "./UserMenu";
import ThemeToggler from "./ThemeToggler";
import SearchBar from "../search-bar/SearchBar";
import Link from "next/link";
import ResultTypeSelector from "./ResultTypeSelector";
import { IconGoGame, IconHelp, IconHome, IconList } from "@tabler/icons-react";
import NavLinkItem from "./DrawerNavLinks";
import { LinkData } from "@/app/lib/definitions";
import DrawerNavLinks from "./DrawerNavLinks";
import NavDrawer from "./NavDrawer";

const links: Array<LinkData> = [
  {
    link: "/",
    label: "Home",
    icon: <IconHome />,
  },

  {
    link: "/",
    label: "Lists",
    icon: <IconList />,
  },
  { link: "/", label: "Practice", icon: <IconGoGame /> },
  {
    link: "#1",
    label: "Support",
    icon: <IconHelp />,
    links: [
      { link: "/", label: "Contact Us" },
      { link: "/", label: "Donate" },
      { link: "/", label: "Help" },
      { link: "/", label: "FAQ" },
      { link: "/", label: "About" },
    ],
  },
];

const Navbar = () => {
  const [drawerOpened, handlers] = useDisclosure(false);

  return (
    <>
      <header className={classes.header}>
        <Container className="align-middle" size="lg">
          <Group h="56" justify="space-between">
            <Group justify="flex-start">
              <Link href="\">
                <JadeLogo h="48" />
              </Link>

              <Group visibleFrom="md">
                {links.map((link, index) => (
                  <MenuItem link={link} key={index} />
                ))}
              </Group>
            </Group>

            <Group
              className="flex flex-1 justify-center items-center max-w-full"
              justify="center"
            >
              <SearchBar />
            </Group>

            <Group justify="flex-end" visibleFrom="sm">
              <ResultTypeSelector />
              <ThemeToggler />
              <UserMenu />
            </Group>

            <Burger
              size="sm"
              opened={drawerOpened}
              onClick={handlers.toggle}
              hiddenFrom="md"
            />
          </Group>
        </Container>
      </header>
      <NavDrawer links={links} opened={drawerOpened} handlers={handlers} />
    </>
  );
};

export default Navbar;
