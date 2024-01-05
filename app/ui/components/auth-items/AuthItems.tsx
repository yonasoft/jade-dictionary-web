"use client";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";
import React, { useEffect } from "react";
import UserMenu from "./UserMenu";
import AuthButtons from "./buttons/AuthButtons";

type Props = {
  additionalOnClick?: () => void;
};

const AuthItems = ({ additionalOnClick }: Props) => {
  const firebase = useFirebaseContext();
  useEffect(() => {}, [firebase.currentUser]);

  return firebase.currentUser ? (
    <UserMenu />
  ) : (
    <AuthButtons additionalOnClick={additionalOnClick} />
  );
};

export default AuthItems;
