"use client";
import { Button, Input, Textarea, Title, Text, Center } from "@mantine/core";
import { ContextModalProps, modals } from "@mantine/modals";
import classes from "./VerifyEmailModal.module.css";
import React, { useEffect, useState } from "react";
import { createWordList } from "@/app/lib/firebase/wordLists-storage";
import { useFirebaseContext } from "@/app/providers/FirebaseProvider";

type Props = {};

const AddWordListModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ onListAdded: () => void }>) => {
  const firebase = useFirebaseContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onSave = async () => {
    try {
      await createWordList(
        firebase.currentUser?.uid as string,
        firebase.firestore,
        title,
        description
      );
      context.closeModal(id);
      innerProps.onListAdded(); // Invoke callback after successful addition
    } catch (error) {
      console.error("Error creating word list:", error);
    }
  };

  return (
    <>
      <Input.Wrapper label="Title">
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </Input.Wrapper>
      <Textarea
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        label="Description(optional)"
        autosize
        minRows={3}
      />
      <Center className="mt-4">
        <Button
          variant="filled"
          disabled={title.trim() == ""}
          onClick={() => {
            onSave();
          }}
        >
          Save
        </Button>
      </Center>
    </>
  );
};

export default AddWordListModal;
