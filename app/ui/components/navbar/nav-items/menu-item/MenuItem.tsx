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
      <Menu.Item key={index}>
        <Link href={item.link} passHref>
          <a className={classes.link}>{item.label}</a>
        </Link>
      </Menu.Item>
    ));

  if (link.sublinks && link.sublinks.length > 0) {
    return (
      <Menu trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
        <Menu.Target>
          <Center>
            {link.label}
            <AccordionChevron size="14px" />
          </Center>
        </Menu.Target>
        <Menu.Dropdown>{generateMenuLinks(link.sublinks)}</Menu.Dropdown>
      </Menu>
    );
  } else {
    return (
      <Link href={link.link} className={classes.link}>
        {link.label}
      </Link>
    );
  }
};

export default MenuItem;
