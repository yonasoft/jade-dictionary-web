"use client";
import React from "react";
import Link from "next/link";

import { Group, Burger, Container, Flex, Space } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import MenuItem from "./components/menu-item/MenuItem";
import JadeLogo from "../JadeLogo";
import ThemeToggler from "./components/theme-toggler/ThemeToggler";
import NavDrawer from "./components/drawer/NavDrawer";
import AuthItems from "../auth-items/AuthItems";
import NavSearchBar from "./components/nav-search-bar/NavSearchBar";
import { navLinks } from "@/src/lib/constants/navLinks";
import { render } from "react-dom";

const Navbar = () => {
  const [drawerOpened, { open, close, toggle }] = useDisclosure(false);

  const renderMenuItems = () => {
    return navLinks.map((link) => <MenuItem link={link} key={link.label} />);
  };

  return (
    <header className="z-30 w-full border-green-200">
      <Container className="flex" size="lg">
        <JadeLogo h={64} />
        <Flex className="w-full mt-4">
          <Space w="lg" />
          <Flex direction="column" className="flex-grow">
            <Flex className="w-full   items-center" direction="row">
              <NavSearchBar className="flex-grow " />
              <Group visibleFrom="sm">
                <ThemeToggler className="flex-shrink mx-4" size="xl" />
                <AuthItems />
              </Group>
            </Flex>
            <Group
              className="flex-grow p-0  rounded-full shadow-lg "
              justify="center"
              visibleFrom="sm"
            >
              {renderMenuItems()}
            </Group>
          </Flex>
          <Burger
            size="sm"
            opened={drawerOpened}
            onClick={toggle}
            hiddenFrom="sm"
            className="mx-4"
          />
        </Flex>
      </Container>
      <NavDrawer links={navLinks} opened={drawerOpened} onClose={close} />
    </header>
  );
};

export default Navbar;
