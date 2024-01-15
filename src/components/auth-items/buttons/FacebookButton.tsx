import { signInWithFacebook } from "@/src/lib/firebase/authentication";
import { useFirebaseContext } from "@/src/providers/FirebaseProvider";
import { Button, ButtonProps } from "@mantine/core";
import { IconBrandFacebook } from "@tabler/icons-react";

type Props = ButtonProps & {
  onClick?: () => void;
};

export function FacebookButton({ onClick, ...buttonProps }: Props) {
  const { auth, firestore } = useFirebaseContext();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      signInWithFacebook(auth, firestore);
    }
  };

  return (
    <Button
      className="my-2"
      leftSection={
        <IconBrandFacebook
          style={{ width: "1rem", height: "1rem" }}
          color="#00ACEE"
        />
      }
      variant="default"
      {...buttonProps}
      fullWidth
      onClick={handleClick}
    />
  );
}
