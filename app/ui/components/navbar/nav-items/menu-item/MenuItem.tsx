import React from "react";
import Link from "next/link";
import { Menu, Center, AccordionChevron } from "@mantine/core";
import { LinkData } from "@/app/lib/definitions";
import classes from "./MenuItem.module.css";

type Props = {
  link: LinkData;
};

const MenuItem = ({ link }: Props) => {
  const generateMenuLinks = (sublinks: Array<LinkData>) =>
    sublinks.map((item, index) => (
      <Menu.Item key={index}>{item.label}</Menu.Item>
    ));

  if (link.sublinks && link.sublinks.length > 0) {
    return (
      <Menu trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
        <Menu.Target>
          <Link
            href={link.link}
            className={classes.link}
            onClick={(e) => e.preventDefault()}
          >
            <Center>
              <span className={classes.linkLabel}>{link.label}</span>
              <AccordionChevron size="14px" />
            </Center>
          </Link>
        </Menu.Target>
        <Menu.Dropdown>{generateMenuLinks(link.sublinks)}</Menu.Dropdown>
      </Menu>
    );
  } else {
    return (
      <Link
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Link>
    );
  }
};

export default MenuItem;
