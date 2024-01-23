import { Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

type Props = {
  h: number;
};

const JadeLogo = ({ h = 48 }: Props) => {
  const isSmallScreen = useMediaQuery("(max-width: 639px)");
  const logoSrc = isSmallScreen ? "/image/jadeicon.png" : "/image/jadelogo.png";

  return <Image className="m-4" id="logo" src={logoSrc} h={h} w="auto" />;
};

export default JadeLogo;
