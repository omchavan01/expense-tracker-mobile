import { Text } from "react-native";

import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon, CloseIcon } from "@/components/ui/icon";
import FormController from "@/components/common/controllers/form-controller";
import { NewCategoryModalProps } from "@/utils/lib/types";

const NewCategoryModal = <T extends Record<string, any>>({
  isOpen,
  control,
  name,
  handleCreateCategory,
  handleCloseModal,
  handleClearCategoryName,
}: NewCategoryModalProps<T>) => {
  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} size="lg">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-lg font-semibold">Create Category</Text>
          <ModalCloseButton>
            <Icon as={CloseIcon} size="xl" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <FormController
            control={control}
            name={name}
            placeholder="Enter category name"
            isMandatory={false}
            showIcon={true}
            rightIcon={CloseIcon}
            onRightIconPress={handleClearCategoryName}
          />
        </ModalBody>
        <ModalFooter>
          <Button onPress={handleCreateCategory}>
            <ButtonText size="md">Create Category</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewCategoryModal;
