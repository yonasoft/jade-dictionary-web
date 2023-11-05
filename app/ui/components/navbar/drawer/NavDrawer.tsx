import React from "react";
import { Center, Divider, Drawer, Group, RemoveScroll } from "@mantine/core";

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
          <Group className="grow " justify="space-between" hiddenFrom="sm">
            <JadeLogo h="40" />
            <ResultTypeSelector />
            <ThemeToggler />
          </Group>
          <Drawer.CloseButton />
        </Drawer.Header>

        <Drawer.Body>
          <DrawerNavLinks links={links} />

          <Divider className="my-3" size="sm" hiddenFrom="sm" />

          <Group className="grow py-y" justify="center" hiddenFrom="sm">
            <AuthButtons />
          </Group>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  );
};

export default NavDrawer;
