import { signInWithFacebook } from "@/app/lib/firebase/authentication";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { Button, ButtonProps } from "@mantine/core";
import { IconBrandFacebook } from "@tabler/icons-react";

type Props = ButtonProps & {
  onClick?: () => void;
};

export function FacebookButton({ onClick, ...buttonProps }: Props) {
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
      onClick={() => {
        if (onClick) {
          onClick();
        } else {
          // Default onClick behavior (if not provided via props)
          // Example: signInWithFacebook(firebase.auth, firebase.firestore);
        }
      }}
    />
  );
}
