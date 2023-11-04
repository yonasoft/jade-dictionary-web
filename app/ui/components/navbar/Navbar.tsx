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
import { LinkData } from "../../../lib/definitions";
import ResultTypeSelector from "./ResultTypeSelector";
import { IconGoGame, IconHelp, IconHome, IconList } from "@tabler/icons-react";

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
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <>
      <header className={classes.header}>
        <Container className="align-content: center" size="lg">
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
        padding="xs"
        zIndex={1000000}
        position="left"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        transitionProps={{
          transition: "rotate-left",
          duration: 150,
          timingFunction: "linear",
        }}
        closeOnClickOutside
        closeOnEscape
      >
        <Drawer.Content className={RemoveScroll.classNames.zeroRight}>
          <Drawer.Header>
            <JadeLogo h="48" />
            <Group className="grow" justify="flex-end" hiddenFrom="sm">
              <ThemeToggler />
              <UserMenu />
            </Group>
            <Drawer.CloseButton />
          </Drawer.Header>

          <Drawer.Body>
            <Group className="grow px-3" justify="center" hiddenFrom="sm">
              <ResultTypeSelector />
            </Group>
            {links.map((link, index) => (
              <NavLink
                key={index}
                label={link.label}
                leftSection={
                  <ActionIcon className={classes.navicon}>
                    {link.icon}
                  </ActionIcon>
                }
                component={Link}
                href={link.link}
              >
                {link.links?.map((item, index) => (
                  <NavLink
                    key={index}
                    label={item.label}
                    component={Link}
                    href={item.link}
                  />
                ))}
              </NavLink>
            ))}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </>
  );
};

export default Navbar;
