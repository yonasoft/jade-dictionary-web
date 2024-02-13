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

const Navbar = () => {
  const [drawerOpened, { open, close, toggle }] = useDisclosure(false);

  const renderMenuItems = () => {
    return navLinks.map((link) => <MenuItem link={link} key={link.label} />);
  };

  return (
    <>
      <Container className="my-0" size="lg">
        <header className="m-0 z-30 w-full flex flex-row justify-start items-center">
          <Link className="me-2" href="/"  passHref>
            <JadeLogo h={52} />
          </Link>
          <NavSearchBar className="flex-grow" />

          <Group visibleFrom="xs">
            <ThemeToggler className="flex-shrink ms-2" size="xl" />
            <AuthItems shrinkUser />
          </Group>
          <Burger
            size="sm"
            opened={drawerOpened}
            onClick={toggle}
            hiddenFrom="xs"
            className="mx-4"
          />
        </header>
        <Group
          className="flex w-full rounded-full shadow-md justify-center align-middle"
          visibleFrom="xs"
        >
          {renderMenuItems()}
        </Group>
      </Container>
      <NavDrawer links={navLinks} opened={drawerOpened} onClose={close} />
    </>
  );
};

export default Navbar;

// <Container className="flex" size="lg">

//   <Flex className="w-full mt-4">
//     <Space w="lg" />
//     <Flex direction="column" className="flex-grow">
//       <Flex className="w-full   items-center" direction="row">
//

//       </Flex>
//     </Flex>

//   </Flex>
// </Container>
