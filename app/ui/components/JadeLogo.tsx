"use client";
import { Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";

type Props = {
  h?: string;
  w?: string;
};

const JadeLogo = ({ h = "16" }: Props) => {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const isMediumScreen = useMediaQuery("(max-width: 768px)");

  let logoSrc = "/image/jadelogo.png";
  if (isSmallScreen) {
    logoSrc = "/image/jadeicon.png";
  } else if (isMediumScreen) {
    logoSrc = "/image/jadelogo.png";
  }

  return (
    <>
      <Image src={logoSrc} h={h} w="auto" alt="Jade Logo" />
    </>
  );
};

export default JadeLogo;
