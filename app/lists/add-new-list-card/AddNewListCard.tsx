"use client";
import React from "react";
import { Card, Button, Center, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

const AddNewListCard = ({ onAddNew }: { onAddNew: () => void }) => {
  return (
    <Card
      className="mt-3 me-3 px-3 w-60 h-70 relative cursor-pointer bg-white rounded-lg hover:bg-gray-100 focus-within:border focus-within:border-jade-color"
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
