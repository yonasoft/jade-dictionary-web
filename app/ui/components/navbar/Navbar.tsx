"use client";
import React from "react";
import {
  Menu,
  Group,
  Center,
  Burger,
  Container,
  AccordionChevron,
  Drawer,
} from "@mantine/core";
import classes from "./Navbar.module.css";
import MenuItem from "./MenuItem";
import { useDisclosure } from "@mantine/hooks";
import JadeLogo from "../JadeLogo";
import UserMenu from "./UserMenu";
import ThemeToggler from "./ThemeToggler";
import SearchBar from "../search-bar/SearchBar";

const links: Array<Link> = [
  { link: "/", label: "Home" },
  {
    link: "/",
    label: "Lists",
  },
  { link: "/", label: "Practice" },
  {
    link: "#1",
    label: "Support",
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
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <>
      <header className={classes.header}>
        <Container className="align-content: center" size="xl">
          <Group h="56" justify="space-between" gap="sm">
            <JadeLogo h="48" />

            <Group
              visibleFrom="sm" gap={10}>
              {links.map((link, index) => (
                <MenuItem link={link} key={index} />
              ))}
            </Group>

            <Group visibleFrom="xs">
              <SearchBar />
            </Group>

            <Group visibleFrom="md">
              <UserMenu />
              <ThemeToggler />
            </Group>

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="md"
            />
          </Group>
        </Container>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="md"
        zIndex={1000000}
      ></Drawer>
    </>
  );
};

export default Navbar;
