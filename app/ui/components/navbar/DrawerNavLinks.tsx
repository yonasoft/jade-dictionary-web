import { LinkData } from "@/app/lib/definitions";
import { ActionIcon, NavLink } from "@mantine/core";
import Link from "next/link";
import React from "react";
import classes from "./Navbar.module.css";

type Props = {
  links: Array<LinkData>;
};

const DrawerNavLinks = ({ links }: Props) => {
  return (
    <>
      {links.map((link, index) => (
        <NavLink
          key={index}
          label={link.label}
          leftSection={
            <ActionIcon className={classes.navicon}>{link.icon}</ActionIcon>
          }
          component={Link}
          href={link.link}
        >
          {link.links?.map((subLink, subIndex) => (
            <NavLink
              key={subIndex}
              label={subLink.label}
              component={Link}
              href={subLink.link}
            />
          ))}
        </NavLink>
      ))}
    </>
  );
};

export default DrawerNavLinks;
