import { Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

type Props = {
  h?: string;
};

const JadeLogo = ({ h = "16" }: Props) => {
  const isLargeScreen = useMediaQuery("(min-width: 640px)");

  const logoSrc = isLargeScreen ? "/image/jadelogo.png" : "/image/jadeicon.png";

  return <Image src={logoSrc} h={h} w="auto" alt="Jade Logo" />;
};

export default JadeLogo;
