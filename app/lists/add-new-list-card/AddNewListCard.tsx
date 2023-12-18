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
    <Card className="cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-6 focus-within:border focus-within:border-jade-color shadow-lg rounded-md overflow-hidden flex items-center justify-center">
      <Button onClick={onAddNew} variant="subtle" className="text-lg">
        <IconPlus size={40} />
        <Text className="mt-4">Add New List</Text>
      </Button>
    </Card>
  );
};

export default AddNewListCard;
