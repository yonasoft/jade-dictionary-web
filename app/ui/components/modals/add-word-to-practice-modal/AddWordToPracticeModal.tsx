import { Modal } from "@mantine/core";
import React from "react";

type Props = {
  opened: boolean;
  close: () => void;
};

const AddWordToPracticeModal = ({ opened, close }: Props) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Add words to practice"
      centered
	  >
		   
	</Modal>
  );
};

export default AddWordToPracticeModal;
