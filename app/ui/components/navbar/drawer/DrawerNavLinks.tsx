import React from "react";
import Link from "next/link";
import { ActionIcon, NavLink } from "@mantine/core";

import classes from "./NavDrawer.module.css";
import { LinkData } from "@/app/lib/types/nav";

type Props = {
  links: Array<LinkData>;
  onClick: () => void;
};

const DrawerNavLinks = ({ links, onClick }: Props) => {
  const generateSubLinks = (sublinks: Array<LinkData>) =>
    sublinks?.map((subLink, subIndex) => (
      <NavLink
        key={subIndex}
        label={subLink.label}
        component={Link}
        href={subLink.link}
        onClick={onClick}
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
            onClick={() => {
              link.sublinks && link.sublinks.length > 0 ? null : onClick();
            }}
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
