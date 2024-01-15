import { useForm } from "@mantine/form";
import { useState } from "react";
import { useFirebaseContext } from "../providers/FirebaseProvider";
import { openContextModal } from "@mantine/modals";
import { checkEmailExists } from "../lib/firebase/storage/user";
import { updateUserEmail, updateUserPassword } from "../lib/firebase/authentication";


export const useProfileForm = () => {
  const { currentUser, firestore, auth } = useFirebaseContext();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalClosed, setIsModalClosed] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      emailConfirmation: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const validateEmail = async () => {
    const { email, emailConfirmation } = form.values;
    setEmailError(""); // Reset email error

    if (email !== emailConfirmation) {
      setEmailError("Emails do not match.");
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      return false;
    }

    if (email === currentUser?.email) {
      setEmailError("Email is the same as current email.");
      return false;
    }

    console.log("checking email exists");
    const emailExists = await checkEmailExists(firestore, email);
    if (emailExists) {
      setEmailError("Email already in use. Please use a different email.");
      console.log("email exists");
      return false;
    }

    setWarningMessage(
      `Check your email (${email.toUpperCase}) for a verification link. You will be logged out after changing your email.`
    );
    return true;
  };

  const validatePassword = () => {
    const { password, passwordConfirmation } = form.values;
    setPasswordError("");

    if (password !== passwordConfirmation) {
      setPasswordError("Passwords do not match.");
      return false;
    }

    if (password.length < 10 || !/\d/.test(password)) {
      setPasswordError(
        "Password must be at least 10 characters long and include numbers."
      );
      return false;
    }

    return true;
  };

  const requireReauth = () => {
    openContextModal({
      modal: "reAuth",
      title: "Please re-authenticate to continue.",
      innerProps: {},
      onClose: () => {
        setIsModalClosed(true);
      },
    });
  };

  const updateInformation = async () => {
    console.log("updateInformation");

    setEmailError("");
    setPasswordError("");
    setErrorMessage("");
    setSuccessMessage("");
    setWarningMessage("");

    try {
      let isEmailValid = true;
      let isPasswordValid = true;

      if (form.values.email) {
        isEmailValid = await validateEmail();
        if (isEmailValid && form.values.email !== currentUser?.email) {
          try {
            await updateUserEmail(auth, form.values.email);
            setSuccessMessage("Email updated successfully");
          } catch (error: any) {
            if (error.code === "auth/requires-recent-login") {
              requireReauth();
            } else {
              setEmailError("Failed to update email. Please try again later.");
            }
          }
        }
      }

      if (form.values.password) {
        isPasswordValid = validatePassword();
        if (isPasswordValid) {
          try {
            await updateUserPassword(auth, form.values.password);
            setWarningMessage("Check you new email for a verification link.");
          } catch (error: any) {
            if (error.code === "auth/requires-recent-login") {
              // Open the reauthentication modal
              requireReauth();
            } else {
              // Handle other types of errors
              setPasswordError(
                "Failed to update password. Please try again later."
              );
            }
          }
        }
      }

      if (isEmailValid && isPasswordValid) {
        setSuccessMessage("Successfully updated information.");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      setErrorMessage("Failed to update information. Please try again later.");
    }
  };

  return {
    form,
    validateEmail,
    validatePassword,
    emailError,
    passwordError,
    errorMessage,
    warningMessage,
    successMessage,
    setSuccessMessage,
    setErrorMessage,
    setEmailError,
    setWarningMessage,
    setPasswordError,
    updateInformation,
    isModalClosed,
    setIsModalClosed,
  };
};
