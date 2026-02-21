import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axiosInstance from "@/utils/lib/axios";
import {
  defaultOnboardingCategoryInfoValues,
  onboardingCategoryInfoSchema,
  OnboardingCategoryInfoType,
} from "@/utils/schemas/onboarding/onboarding-schema";
import { useHaptics } from "@/utils/lib/haptics";
import { useShowToast } from "@/utils/lib/show-toast";
import { getErrorMessage } from "@/utils/lib/error-helper";
import { OnboardingCategoryOption } from "@/utils/lib/types";
import { onboardingCategoryList } from "@/constants/json/onboarding-category-list";

const MIN_SELECTED_CATEGORIES = 5;
const MAX_SELECTED_CATEGORIES = 15;
const MAX_TOTAL_CATEGORIES = 30;

const useOnboardingCategoryInfo = () => {
  const router = useRouter();
  const showToast = useShowToast();
  const { notificationHaptics } = useHaptics();
  const { control, setError, handleSubmit, clearErrors, reset } =
    useForm<OnboardingCategoryInfoType>({
      resolver: zodResolver(onboardingCategoryInfoSchema),
      defaultValues: defaultOnboardingCategoryInfoValues,
    });

  const [newCategoryModalOpen, setNewCategoryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<
    OnboardingCategoryOption[]
  >(onboardingCategoryList);

  const selectedCount = useMemo(
    () => categoryOptions.filter((category) => category.isSelected).length,
    [categoryOptions],
  );
  const canUnselectOrDelete = selectedCount > MIN_SELECTED_CATEGORIES;
  const canSelectMore = selectedCount < MAX_SELECTED_CATEGORIES;
  const canCreateCategory = categoryOptions.length < MAX_TOTAL_CATEGORIES;

  const onCreateCategory = (payload: OnboardingCategoryInfoType) => {
    if (categoryOptions.length >= MAX_TOTAL_CATEGORIES) {
      showToast({
        title: "You've added quite a few categories",
        description: "Delete one to add another",
        type: "error",
      });
      return;
    }
    if (
      categoryOptions.find(
        (category) =>
          category.value.toLowerCase() === payload.categoryName.toLowerCase(),
      )
    ) {
      setError("categoryName", { message: "Category already exists" });
      return;
    }
    const selectNewCategory = selectedCount < MAX_SELECTED_CATEGORIES;
    setCategoryOptions((prev) => {
      const newCategory = {
        label: payload.categoryName,
        value: payload.categoryName,
        isSelected: selectNewCategory,
      };

      if (selectNewCategory) return [newCategory, ...prev];
      return [...prev, newCategory];
    });
    reset({ categoryName: "" });
  };

  const handleSelectCategory = (option: OnboardingCategoryOption) => {
    if (selectedCount >= MAX_SELECTED_CATEGORIES) {
      showToast({
        title: "You've reached the limit",
        description: "Unselect one to add another",
        type: "error",
      });
      return;
    }
    setCategoryOptions((prev) =>
      prev.map((category) => ({
        ...category,
        isSelected:
          category.value === option.value ? true : category.isSelected,
      })),
    );
  };

  const handleUnselectCategory = (option: OnboardingCategoryOption) => {
    if (selectedCount <= MIN_SELECTED_CATEGORIES) {
      showToast({
        title: "At least 5 categories are needed",
        description: "Add one before removing",
        type: "error",
      });
      return;
    }
    setCategoryOptions((prev) =>
      prev.map((category) => ({
        ...category,
        isSelected:
          category.value === option.value ? false : category.isSelected,
      })),
    );
  };

  const handleDeleteCategory = (option: OnboardingCategoryOption) => {
    if (option.isSelected && selectedCount <= MIN_SELECTED_CATEGORIES) {
      showToast({
        title: "At least 5 categories are needed",
        description: "Add one before deleting",
        type: "error",
      });
      return;
    }
    setCategoryOptions((prev) =>
      prev.filter((category) => category.value !== option.value),
    );
  };

  const handleClearCategoryName = () => {
    reset({ categoryName: "" });
    clearErrors("categoryName");
  };

  const handleCloseModal = () => {
    handleClearCategoryName();
    setNewCategoryModalOpen(false);
  };

  const sortedCategoryOptions = useMemo(() => {
    return [...categoryOptions].sort(
      (a, b) => Number(b.isSelected) - Number(a.isSelected),
    );
  }, [categoryOptions]);

  const handleMessageAndColor = useMemo(() => {
    if (categoryOptions.length === MAX_TOTAL_CATEGORIES)
      return {
        message: `You've created ${MAX_TOTAL_CATEGORIES} categories. You can't create more.`,
        color: "text-error-500",
      };

    if (selectedCount === MAX_SELECTED_CATEGORIES)
      return {
        message: `${MAX_SELECTED_CATEGORIES} categories selected. You can't select more.`,
        color: "text-amber-500",
      };

    return {
      message: `${selectedCount} categories selected`,
      color: "text-gray-500",
    };
  }, [categoryOptions.length, selectedCount]);

  const onSubmit = async (payload: OnboardingCategoryOption[]) => {
    if (
      payload.filter((category) => category.isSelected).length <
      MIN_SELECTED_CATEGORIES
    ) {
      showToast({
        title: "Almost there",
        description: "Select at least 5 categories to continue.",
        type: "error",
      });
      return;
    }
    const formattedPayload = {
      categoriesInfo: payload.map((category) => ({
        title: category.label,
        value: category.value,
        active: category.isSelected,
      })),
    };

    console.log("formattedPayload", JSON.stringify(formattedPayload, null, 2));

    try {
      setIsSubmitting(true);
      const { data } = await axiosInstance.post(
        "/onboarding/categories-info",
        formattedPayload,
      );
      console.log("data", data);
      showToast({
        title: data.message,
        type: "success",
      });
      notificationHaptics("success");
      router.replace("/(logged)");
    } catch (error: any) {
      console.log("error", error);
      showToast({
        title: getErrorMessage(error),
        type: "error",
      });
      notificationHaptics("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};

export default useOnboardingCategoryInfo;
