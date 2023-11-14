
import React from "react";
import { Box, Divider, Drawer, Group, RemoveScroll } from "@mantine/core";

import { LinkData } from "@/app/lib/definitions";
import JadeLogo from "../../JadeLogo";
import DrawerNavLinks from "./DrawerNavLinks";
import ResultTypeSelector from "../nav-items/result-selector/ScriptTypeSelector";
import ThemeToggler from "../nav-items/theme-toggler/ThemeToggler";
import AuthButtons from "../nav-items/auth-items/AuthButtons";
import AuthItems from "../nav-items/auth-items/AuthItems";

type Props = {
  links: Array<LinkData>;
  opened: boolean;
  onClose: () => void;
};

const NavDrawer = ({ links, opened, onClose }: Props) => {
  return (
    <Drawer.Root
      opened={opened}
      onClose={onClose}
      size="100%"
      padding="xs"
      zIndex={1000}
      position="left"
      transitionProps={{
        transition: "rotate-left",
        duration: 150,
        timingFunction: "linear",
      }}
      closeOnClickOutside
      closeOnEscape
    >
      <Drawer.Overlay />
      <Drawer.Content
        className={`${RemoveScroll.classNames.fullWidth} ${RemoveScroll.classNames.zeroRight}`}
      >
        <Drawer.Header>
          <Group className="grow" justify="space-between">
            <JadeLogo h="40" />
            <Box hiddenFrom="sm">
              <ResultTypeSelector />
            </Box>
            <Box hiddenFrom="sm">
              <ThemeToggler />
            </Box>
          </Group>
          <Drawer.CloseButton />
        </Drawer.Header>

        <Drawer.Body>
          <DrawerNavLinks links={links} />
          <Divider className="my-3" size="sm" hiddenFrom="sm" />
          <Group className="grow my-2" justify="center" hiddenFrom="sm">
            <AuthItems additionalOnClick={onClose} />
          </Group>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default NavDrawer;
