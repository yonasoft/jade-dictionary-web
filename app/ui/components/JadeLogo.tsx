import { Image } from "@mantine/core";
import React from "react";

type Props = {
  h?: string;
  w?: string;
};

const JadeLogo = ({ h = "16", w = "auto" }: Props) => {
  return <Image src="/image/jadelogo.png" h={h} w={w} alt="Jade Logo" />;
};

export default JadeLogo;
