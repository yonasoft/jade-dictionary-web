import { LinkData } from "@/app/lib/definitions";
import { Drawer, Group, RemoveScroll } from "@mantine/core";
import React from "react";
import JadeLogo from "../JadeLogo";
import DrawerNavLinks from "./DrawerNavLinks";
import ResultTypeSelector from "./ResultTypeSelector";
import ThemeToggler from "./ThemeToggler";
import UserMenu from "./UserMenu";

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
            <UserMenu />
          </Group>
          <Drawer.CloseButton />
        </Drawer.Header>

        <Drawer.Body>
          <Group className="grow px-3" justify="center" hiddenFrom="sm">
            <ResultTypeSelector />
          </Group>
          <DrawerNavLinks links={links} />
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  );
};

export default NavDrawer;
