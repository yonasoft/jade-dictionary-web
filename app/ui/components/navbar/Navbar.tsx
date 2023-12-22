"use client";
import React, { useEffect } from "react";
import Link from "next/link";

import { Group, Burger, Container, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDeviceGamepad,
  IconGoGame,
  IconHelp,
  IconHome,
  IconList,
} from "@tabler/icons-react";
import { LinkData } from "@/app/lib/definitions";

import classes from "./Navbar.module.css";

import MenuItem from "./menu-item/MenuItem";
import JadeLogo from "../JadeLogo";
import UserMenu from "../auth-items/UserMenu";
import ThemeToggler from "../theme-toggler/ThemeToggler";
import SearchBar from "./search-bar/NavSearchBar";
import ResultTypeSelector from "../script-selector/ScriptTypeSelector";
import NavDrawer from "./drawer/NavDrawer";
import AuthButtons from "../auth-items/AuthButtons";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import AuthItems from "../auth-items/AuthItems";
import { spotlight } from "@mantine/spotlight";
import NavSearchBar from "./search-bar/NavSearchBar";

const links: Array<LinkData> = [
  {
    link: "/",
    label: "Home",
    icon: <IconHome />,
  },

  {
    link: "/lists",
    label: "Lists",
    icon: <IconList />,
  },
  { link: "/practice", label: "Practice", icon: <IconDeviceGamepad /> },
  {
    link: "#1",
    label: "Support",
    icon: <IconHelp />,
    sublinks: [
      { link: "/support/donate", label: "Donate" },
      { link: "/support/contact", label: "Contact Us" },
      { link: "/support/faq", label: "FAQ" },
      { link: "/support/about", label: "About" },
    ],
  },
];

const Navbar = () => {
  const [drawerOpened, { open, close, toggle }] = useDisclosure(false);

  const renderMenuItems = () =>
    links.map((link) => <MenuItem link={link} key={link.label} />);

  return (
    <header className={classes.header}>
      <Container className="align-middle" size="lg">
        <Group h="56" justify="space-between">
          <Group justify="flex-start">
            <Link href="\" replace={true} passHref>
              <JadeLogo h={56} />
            </Link>

            <Group visibleFrom="md">{renderMenuItems()}</Group>
          </Group>

          <Group
            className="flex flex-1 justify-center items-center max-w-full"
            justify="center"
          >
            <NavSearchBar />
          </Group>

          <Group justify="flex-end" visibleFrom="sm">
            {/* <ResultTypeSelector /> */}
            <AuthItems />
            <ThemeToggler />
          </Group>
          <Burger
            size="sm"
            opened={drawerOpened}
            onClick={toggle}
            hiddenFrom="md"
          />
        </Group>
      </Container>
      <NavDrawer links={links} opened={drawerOpened} onClose={close} />
    </header>
  );
};

export default Navbar;
