import React from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";

import NoInternet from "@/components/common/no-internet";
import useOnboardingCategoryInfo from "@/hooks/onboarding/use-category-info";
import { useNetInfo } from "@/contexts/net-info-provider";
import OnboardingCategoryBox from "@/components/onboarding/category-box";
import NewCategoryModal from "@/components/onboarding/new-category-modal";

const OnboardingCategoryInfo = () => {
  const { isConnected } = useNetInfo();
  const {
    control,
    isSubmitting,
    categoryOptions,
    sortedCategoryOptions,
    newCategoryModalOpen,
    setNewCategoryModalOpen,
    handleSubmit,
    onCreateCategory,
    handleSelectCategory,
    handleUnselectCategory,
    handleDeleteCategory,
    handleCloseModal,
    handleClearCategoryName,
    handleMessageAndColor,
    onSubmit,
    canUnselectOrDelete,
    canSelectMore,
    canCreateCategory,
  } = useOnboardingCategoryInfo();

  return (
    <>
      <View className="flex-1 bg-white px-4">
        <KeyboardAwareScrollView
          className="mt-10"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-2xl font-bold mb-12">Category Information</Text>
          <OnboardingCategoryBox
            categoryOptions={sortedCategoryOptions}
            handleSelectCategory={handleSelectCategory}
            handleUnselectCategory={handleUnselectCategory}
            handleDeleteCategory={handleDeleteCategory}
            handleAddCategory={() => setNewCategoryModalOpen(true)}
            canUnselectOrDelete={canUnselectOrDelete}
            canSelectMore={canSelectMore}
            canCreateCategory={canCreateCategory}
          />
          <Text
            className={`text-xs ${handleMessageAndColor.color} mt-2
            `}
          >
            {handleMessageAndColor.message}
          </Text>
        </KeyboardAwareScrollView>
        <View className="py-10 w-full flex justify-center items-center">
          <Button
            onPress={() => onSubmit(categoryOptions)}
            variant="solid"
            size="xl"
            className="rounded-full bg-primary-600 w-[75%]"
            disabled={!isConnected || isSubmitting}
          >
            {isSubmitting && <ButtonSpinner className="text-white" />}
            <ButtonText size="md">
              {isSubmitting ? "Submitting" : "Continue"}
            </ButtonText>
          </Button>
        </View>
      </View>
      {!isConnected && <NoInternet />}
      {newCategoryModalOpen && (
        <NewCategoryModal
          control={control}
          name="categoryName"
          isOpen={newCategoryModalOpen}
          handleCloseModal={handleCloseModal}
          handleCreateCategory={handleSubmit(onCreateCategory)}
          handleClearCategoryName={handleClearCategoryName}
        />
      )}
    </>
  );
};

export default OnboardingCategoryInfo;
