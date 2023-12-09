import React from "react";
import {
  Card,
  Button,
  Center,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { openContextModal } from "@mantine/modals";
import classes from "./AddNewListCard.module.css";

type Props = {
  onListAdded: () => void;
};

const AddNewListCard = ({ onListAdded }: Props) => {
  const { colorScheme } = useMantineColorScheme();
  const hoverClass =
    colorScheme === "dark" ? "card-hover-dark" : "card-hover-light";

  const onAddNew = () => {
    openContextModal({
      centered: true,
      modal: "addWordList",
      title: "Add new word list",
      innerProps: { onListAdded: onListAdded },
      // Pass the callback to the modal
    });
  };

  return (
    <Card
      className={`cursor-pointer ${hoverClass} ${classes.wordCard} focus-within:border focus-within:border-jade-color h-36 overflow-ellipsis`}
      shadow="lg"
      radius="md"
      withBorder
      onClick={onAddNew}
    >
      <Center style={{ height: "100%" }}>
        <Button variant="subtle" size="lg">
          <IconPlus size={40} />
        </Button>
      </Center>
      <Text className="text-center mt-4 text-lg">Add New List</Text>
    </Card>
  );
};

export default AddNewListCard;
