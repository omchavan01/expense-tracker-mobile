import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import Header from "@/components/common/header";
import NoInternet from "@/components/common/no-internet";
import useOnboardingCategoryInfo, {
  CATEGORY_TYPE_OPTIONS,
} from "@/hooks/onboarding/use-category-info";
import { useNetInfo } from "@/contexts/net-info-provider";
import OnboardingCategoryBox from "@/components/onboarding/category-box";
import NewCategoryModal from "@/components/onboarding/new-category-modal";

const OnboardingCategoryInfo = () => {
  const { isConnected } = useNetInfo();
  const {
    control,
    isSubmitting,
    categoryType,
    expenseCategoryOptions,
    incomeCategoryOptions,
    sortedCategoryOptions,
    newCategoryModalOpen,
    setNewCategoryModalOpen,
    handleSubmit,
    handleCategoryTypeSelect,
    onCreateCategory,
    handleSelectCategory,
    handleUnselectCategory,
    handleDeleteCategory,
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
          <Header title="Category Information" />
          <View className="mb-4 flex flex-row items-center justify-between rounded-full bg-gray-100">
            {CATEGORY_TYPE_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                className={`flex ${
                  categoryType === option.value
                    ? "flex-[1.2] bg-primary-600"
                    : "flex-1"
                } items-center justify-center rounded-full p-3`}
                onPress={() => handleCategoryTypeSelect(option.value)}
              >
                <Text
                  className={`${
                    categoryType === option.value
                      ? "font-medium text-white"
                      : "text-typography-400"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
        </KeyboardAwareScrollView>
        <View className="flex w-full items-center justify-center py-10">
          <Button
            onPress={() =>
              onSubmit(expenseCategoryOptions, incomeCategoryOptions)
            }
            variant="solid"
            size="xl"
            className="w-[75%] rounded-full bg-primary-600"
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
