import React from "react";
import {
  Box,
  Center,
  Divider,
  Drawer,
  Group,
  RemoveScroll,
} from "@mantine/core";

import { LinkData } from "@/app/lib/definitions";
import JadeLogo from "../../JadeLogo";
import DrawerNavLinks from "./DrawerNavLinks";
import ResultTypeSelector from "../nav-items/result-selector/ResultTypeSelector";
import ThemeToggler from "../nav-items/theme-toggler/ThemeToggler";
import AuthButtons from "../nav-items/auth-items/AuthButtons";

type Props = {
  links: Array<LinkData>;
  opened: boolean;
  handlers: { open: () => void; close: () => void };
};

const NavDrawer = ({ links, opened, handlers }: Props) => {
  return (
    <Drawer
      opened={opened}
      onClose={handlers.close}
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
            <AuthButtons />
          </Group>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  );
};

export default NavDrawer;
