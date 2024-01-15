import React from "react";
import Link from "next/link";
import { ActionIcon, NavLink } from "@mantine/core";
import classes from "./NavDrawer.module.css";
import { LinkData } from "@/src/lib/types/nav";


const generateSubLinks = (sublinks: Array<LinkData>, onClick: () => void) =>
  sublinks?.map((subLink, subIndex) => (
    <NavLink
      key={subIndex}
      label={subLink.label}
      component={Link}
      href={subLink.link}
      onClick={onClick}
    />
  ));

type Props = {
  links: Array<LinkData>;
  onClick: () => void;
};

const DrawerNavLinks = ({ links, onClick }: Props) => {
  const handleLinkClick = (link: LinkData) => {
    if (!(link.sublinks && link.sublinks.length > 0)) {
      onClick();
    }
  };

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
              handleLinkClick(link);
            }}
          >
            {link.sublinks &&
              link.sublinks.length > 0 &&
              generateSubLinks(link.sublinks, onClick)}
          </NavLink>
        );
      })}
    </>
  );
};

export default DrawerNavLinks;
