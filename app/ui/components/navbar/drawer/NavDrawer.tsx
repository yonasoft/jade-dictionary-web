import React from "react";
import { Center, Drawer, Group, RemoveScroll } from "@mantine/core";

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
      <Drawer.Content className={RemoveScroll.classNames.zeroRight}>
        <Drawer.Header>
          <JadeLogo h="40" />
          <Group className="grow" justify="flex-end" hiddenFrom="sm">
            <ThemeToggler />
          </Group>
          <Drawer.CloseButton />
        </Drawer.Header>

        <Drawer.Body>
          <Group className="grow my-2" justify="center" hiddenFrom="sm">
            <ResultTypeSelector />
          </Group>
          <DrawerNavLinks links={links} />
          <Group className="grow my-3" justify="center" gap="xs">
            <AuthButtons />
          </Group>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  );
};

export default NavDrawer;
