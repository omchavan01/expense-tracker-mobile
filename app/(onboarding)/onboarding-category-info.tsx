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
    newCategoryModalOpen,
    setNewCategoryModalOpen,
    handleSubmit,
    onCreateCategory,
    handleSelectCategory,
    handleUnselectCategory,
    handleDeleteCategory,
    handleResetCategories,
    handleCloseModal,
    handleClearCategoryName,
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
          <Text className="text-2xl font-bold mb-10">Category Information</Text>
          <OnboardingCategoryBox
            categoryOptions={categoryOptions}
            handleSelectCategory={handleSelectCategory}
            handleUnselectCategory={handleUnselectCategory}
            handleDeleteCategory={handleDeleteCategory}
            handleResetCategories={handleResetCategories}
            handleAddCategory={() => setNewCategoryModalOpen(true)}
            canUnselectOrDelete={canUnselectOrDelete}
            canSelectMore={canSelectMore}
            canCreateCategory={canCreateCategory}
          />
          <Text className="text-xs text-gray-500 mt-1 italic">
            Select 5-15 categories. You can create up to 30 categories.
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
              {isSubmitting ? "Submitting..." : "Continue"}
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
