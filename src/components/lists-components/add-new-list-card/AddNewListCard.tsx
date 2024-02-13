import React from "react";
import {
  Card,
  Button,
  Center,
  Text,
  Flex,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { openContextModal } from "@mantine/modals";

type Props = {
  onListAdded: () => void;
};

const AddNewListCard = ({ onListAdded }: Props) => {

  const onAddNew = () => {
    openContextModal({
      centered: true,
      modal: "addWordList",
      title: "Add new word list",
      innerProps: { onListAdded },
    });
  };

  const cardStyles = {
    height: "8em", // Increased height
  };

  return (
    <Card
      style={cardStyles}
      className="cursor-pointer overflow-hidden"
      shadow="sm"
      p="lg"
      onClick={onAddNew}
    >
      <Center style={{ height: "100%" }}>
        <Button variant="subtle" style={{ height: "100%" }} className="text-lg">
          <Flex direction="column" align="center" justify="center">
            <IconPlus size={40} />
            <Text className="mt-4">Add New List</Text>
          </Flex>
        </Button>
      </Center>
    </Card>
  );
};

export default AddNewListCard;
