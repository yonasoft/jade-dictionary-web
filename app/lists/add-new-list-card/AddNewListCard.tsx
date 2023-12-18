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

type Props = {
  onListAdded: () => void;
};

const AddNewListCard = ({ onListAdded }: Props) => {
  const { colorScheme } = useMantineColorScheme();

  const onAddNew = () => {
    openContextModal({
      centered: true,
      modal: "addWordList",
      title: "Add new word list",
      innerProps: { onListAdded },
    });
  };

  const cardStyles = {
    backgroundColor: colorScheme === "dark" ? "#1A1B1E" : "#FFF",
    color: colorScheme === "dark" ? "#FFF" : "#000",
    borderColor: colorScheme === "dark" ? "#333" : "#E2E8F0",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    "&:hover": {
      transform: "scale(1.02)",
      backgroundColor: colorScheme === "dark" ? "#292A2D" : "#F7FAFC",
    },
  };

  return (
    <Card
      style={cardStyles}
      className="cursor-pointer rounded-md overflow-hidden focus:outline-none focus:border-jade-color"
      onClick={onAddNew}
    >
      <Center style={{ height: "100%" }}>
        <Button variant="subtle" className="text-lg">
          <IconPlus size={40} />
          <Text className="mt-4">Add New List</Text>
        </Button>
      </Center>
    </Card>
  );
};

export default AddNewListCard;
