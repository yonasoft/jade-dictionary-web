import React from "react";
import Link from "next/link";

import { LinkData } from "@/app/lib/definitions";
import { ActionIcon, NavLink } from "@mantine/core";

import classes from "./NavDrawer.module.css";

type Props = {
  links: Array<LinkData>;
};

const DrawerNavLinks = ({ links }: Props) => {
  const generateSubLinks = (sublinks: Array<LinkData>) =>
    sublinks?.map((subLink, subIndex) => (
      <NavLink
        key={subIndex}
        label={subLink.label}
        component={Link}
        href={subLink.link}
      />
    ));

  return (
    <>
      {links.map((link, index) => {
        return (
          <NavLink
            key={index}
            label={link.label}
            leftSection={
              <ActionIcon className={classes.navicon}>{link.icon}</ActionIcon>
            }
            component={Link}
            href={link.link}
          >
            {link.sublinks && link.sublinks.length > 0
              ? generateSubLinks(link.sublinks)
              : null}
          </NavLink>
        );
      })}
    </>
  );
};

export default DrawerNavLinks;
