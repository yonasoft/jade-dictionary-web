import Image from "next/image";
import { useMediaQuery } from "@mantine/hooks";

type Props = {
  h: number;
  w?: number;
};

const JadeLogo = ({ h , w }: Props) => {
  const isSmallScreen = useMediaQuery("(max-width: 639px)");
  const logoSrc = isSmallScreen ? "/image/jadeicon.png" : "/image/jadelogo.png";

  // Define the style object with `!important`
  const imageStyle = {
    height: `${h}px`, // Height can be set normally
    width: w ? `${w}px` : "auto !important", // Apply !important using template literals
  };

  return (
    <Image
      src={logoSrc}
      alt="Jade logo"
      height={h}
      width={w ? w : 120} // This sets the width attribute, not the style
      quality={100}
      priority={true}
      style={imageStyle} // Apply the style object here
    />
  );
};

export default JadeLogo;
