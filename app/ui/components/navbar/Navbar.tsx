"use client";
import React from "react";
import Link from "next/link";

import { Group, Burger, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import MenuItem from "./components/menu-item/MenuItem";
import JadeLogo from "../JadeLogo";
import ThemeToggler from "./components/theme-toggler/ThemeToggler";
import NavDrawer from "./components/drawer/NavDrawer";
import AuthItems from "../auth-items/AuthItems";
import NavSearchBar from "./components/nav-search-bar/NavSearchBar";
import { navLinks } from "@/app/lib/constants/navLinks";

const Navbar = () => {
  const [drawerOpened, { open, close, toggle }] = useDisclosure(false);

  const renderMenuItems = () => {
    return navLinks.map((link) => <MenuItem link={link} key={link.label} />);
  };

  return (
    <header className="h-14 mb-7 fixed top-0 z-50 w-full ">
      <Container className="align-middle" size="lg">
        <Group h="56" justify="space-between">
          <Group justify="flex-start">
            <Link href="\" replace={true} passHref>
              <JadeLogo h={48} />
            </Link>
            <nav>
              <Group visibleFrom="md">{renderMenuItems()}</Group>
            </nav>
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
      <NavDrawer links={navLinks} opened={drawerOpened} onClose={close} />
    </header>
  );
};

export default Navbar;
