import {
  IconDeviceGamepad,
  IconHelp,
  IconHome,
  IconList,
} from "@tabler/icons-react";
import { LinkData } from "../types/nav";

export const navLinks: Array<LinkData> = [
  {
    link: "/",
    label: "Home",
    icon: <IconHome />,
  },

  {
    link: "/lists",
    label: "Lists",
    icon: <IconList />,
  },
  { link: "/practice", label: "Practice", icon: <IconDeviceGamepad /> },
  {
    link: "#1",
    label: "Support",
    icon: <IconHelp />,
    sublinks: [
      { link: "/support/donate", label: "Donate" },
      { link: "/support/contact", label: "Contact Us" },
      { link: "/support/faq", label: "FAQ" },
      { link: "/support/about", label: "About" },
    ],
  },
];
