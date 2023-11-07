"use client";
import React from "react";
import Link from "next/link";

import { Group, Burger, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconGoGame, IconHelp, IconHome, IconList } from "@tabler/icons-react";
import { LinkData } from "@/app/lib/definitions";

import classes from "./Navbar.module.css";

import MenuItem from "./nav-items/menu-item/MenuItem";
import JadeLogo from "../JadeLogo";
import UserMenu from "./nav-items/auth-items/UserMenu";
import ThemeToggler from "./nav-items/theme-toggler/ThemeToggler";
import SearchBar from "../search-bar/SearchBar";
import ResultTypeSelector from "./nav-items/result-selector/ScriptTypeSelector";
import NavDrawer from "./drawer/NavDrawer";
import AuthButtons from "./nav-items/auth-items/AuthButtons";

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
  const [drawerOpened, drawerHandlers] = useDisclosure(false);

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
              <AuthButtons />
              <ThemeToggler />
            </Group>

            <Burger
              size="sm"
              opened={drawerOpened}
              onClick={drawerHandlers.toggle}
              hiddenFrom="md"
            />
          </Group>
        </Container>
      </header>

      <NavDrawer
        links={links}
        opened={drawerOpened}
        onClose={drawerHandlers.close}
      />
    </>
  );
};

export default Navbar;
