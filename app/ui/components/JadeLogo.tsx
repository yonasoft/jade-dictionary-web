import { Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

type Props = {
  h?: string;
};

const JadeLogo = ({ h = "16" }: Props) => {
  const isSmallScreen = useMediaQuery("(max-width: 639px)");
  const logoSrc = isSmallScreen ? "/image/jadeicon.png" : "/image/jadelogo.png";

  return <Image src={logoSrc} h={h} w="auto" alt="Jade Logo" />;
};

export default JadeLogo;
