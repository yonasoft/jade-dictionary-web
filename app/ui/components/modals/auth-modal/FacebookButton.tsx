import { signInWithFacebook } from "@/app/lib/firebase/authentication";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import { Button, ButtonProps } from "@mantine/core";
import {} from "@mantine/ds";
import { modals } from "@mantine/modals";
import { IconBrandFacebook } from "@tabler/icons-react";

export function FacebookButton(
  props: ButtonProps & React.ComponentPropsWithoutRef<"button">
) {
  const firebase = useFirebaseContext();

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
      {...props}
      fullWidth
      onClick={() => {
        signInWithFacebook(firebase.auth, firebase.firestore);
         modals.closeAll();
      }}
    />
  );
}
