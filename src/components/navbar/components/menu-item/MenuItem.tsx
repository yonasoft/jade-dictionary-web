import React from "react";
import Link from "next/link";
import { Menu, Center, AccordionChevron, Text } from "@mantine/core";
import classes from "./MenuItem.module.css";
import { LinkData } from "@/src/lib/types/nav";

type Props = {
  link: LinkData;
};

const MenuItem = ({ link }: Props) => {
  const generateMenuLinks = (sublinks: Array<LinkData>) =>
    sublinks.map((item, index) => (
      <Menu.Item key={index}>
        <Link className={classes.link} href={item.link} passHref>
          <Text className={classes.linkLabel}>{item.label}</Text>
        </Link>
      </Menu.Item>
    ));

  if (link.sublinks && link.sublinks.length > 0) {
    // If there are sublinks, render a dropdown menu
    return (
      <Menu trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
        <Menu.Target>
          <Center>
            <Text className={classes.linkLabel}>{link.label}</Text>
            <AccordionChevron size="14px" />
          </Center>
        </Menu.Target>
        <Menu.Dropdown>{generateMenuLinks(link.sublinks)}</Menu.Dropdown>
      </Menu>
    );
  } else {
    // Otherwise, render a regular link
    return (
      <Menu trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
        <Link className={classes.link} href={link.link} passHref>
          <Text className={classes.linkLabel}>{link.label}</Text>
        </Link>
      </Menu>
    );
  }
};

export default MenuItem;
