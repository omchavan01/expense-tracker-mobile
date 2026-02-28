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
import { CategoryType, OnboardingCategoryOption } from "@/utils/lib/types";
import {
  onboardingExpenseCategoryList,
  onboardingIncomeCategoryList,
} from "@/constants/json/onboarding-category-list";

export const CATEGORY_TYPE_OPTIONS: {
  label: string;
  value: CategoryType;
}[] = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];

const CATEGORY_CONFIG = {
  expense: {
    minSelected: 5,
    maxSelected: 15,
    maxTotal: 30,
  },
  income: {
    minSelected: 1,
    maxSelected: 5,
    maxTotal: 10,
  },
};

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
  const [categoryType, setCategoryType] = useState<CategoryType>("expense");
  const [expenseCategoryOptions, setExpenseCategoryOptions] = useState<
    OnboardingCategoryOption[]
  >(onboardingExpenseCategoryList as OnboardingCategoryOption[]);
  const [incomeCategoryOptions, setIncomeCategoryOptions] = useState<
    OnboardingCategoryOption[]
  >(onboardingIncomeCategoryList as OnboardingCategoryOption[]);

  /** Configuration for the category type based on which all the operations are performed */
  const config = CATEGORY_CONFIG[categoryType];
  const currentOptions =
    categoryType === "expense" ? expenseCategoryOptions : incomeCategoryOptions;
  const setCurrentOptions =
    categoryType === "expense"
      ? setExpenseCategoryOptions
      : setIncomeCategoryOptions;

  const selectedCount = useMemo(
    () => currentOptions.filter((category) => category.isSelected).length,
    [currentOptions],
  );
  const canUnselectOrDelete = selectedCount > config.minSelected;
  const canSelectMore = selectedCount < config.maxSelected;
  const canCreateCategory = currentOptions.length < config.maxTotal;

  const handleCategoryTypeSelect = (type: CategoryType) => {
    setCategoryType(type);
  };

  const onCreateCategory = (payload: OnboardingCategoryInfoType) => {
    if (currentOptions.length >= config.maxTotal) {
      showToast({
        title: "You've added quite a few categories",
        description: "Delete one to add another",
        type: "error",
      });
      return;
    }

    if (
      currentOptions.find(
        (category) =>
          category.value.toLowerCase() === payload.categoryName.toLowerCase(),
      )
    ) {
      setError("categoryName", { message: "Category already exists" });
      return;
    }
    const selectNewCategory = selectedCount < config.maxSelected;
    setCurrentOptions((prev) => {
      const newCategory = {
        label: payload.categoryName,
        value: payload.categoryName,
        isSelected: selectNewCategory,
        categoryType: categoryType as CategoryType,
      };
      if (selectNewCategory) return [newCategory, ...prev];
      return [...prev, newCategory];
    });
    reset({ categoryName: "" });
  };

  const handleSelectCategory = (option: OnboardingCategoryOption) => {
    if (selectedCount >= config.maxSelected) {
      showToast({
        title: "You've reached the limit",
        description: "Unselect one to add another",
        type: "error",
      });
      return;
    }
    setCurrentOptions((prev) =>
      prev.map((category) => ({
        ...category,
        isSelected:
          category.value === option.value ? true : category.isSelected,
      })),
    );
  };

  const handleUnselectCategory = (option: OnboardingCategoryOption) => {
    if (selectedCount <= config.minSelected) {
      showToast({
        title: `At least ${config.minSelected} ${categoryType} categories are needed`,
        description: "Add one before removing",
        type: "error",
      });
      return;
    }
    setCurrentOptions((prev) =>
      prev.map((category) => ({
        ...category,
        isSelected:
          category.value === option.value ? false : category.isSelected,
      })),
    );
  };

  const handleDeleteCategory = (option: OnboardingCategoryOption) => {
    if (option.isSelected && selectedCount <= config.minSelected) {
      showToast({
        title: `At least ${config.minSelected} ${categoryType} categories are needed`,
        description: "Add one before deleting",
        type: "error",
      });
      return;
    }
    setCurrentOptions((prev) =>
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
    return [...currentOptions].sort(
      (a, b) => Number(b.isSelected) - Number(a.isSelected),
    );
  }, [currentOptions]);

  const handleMessageAndColor = useMemo(() => {
    if (currentOptions.length === config.maxTotal) {
      return {
        message: `You've created ${config.maxTotal} ${categoryType} categories. You can't create more.`,
        color: "text-error-500",
      };
    }
    if (selectedCount === config.maxSelected) {
      return {
        message: `You've selected ${config.maxSelected} ${categoryType} categories. You can't select more.`,
        color: "text-amber-500",
      };
    }
    return {
      message: `${selectedCount} ${categoryType} categories selected`,
      color: "text-gray-500",
    };
  }, [
    categoryType,
    config.maxSelected,
    config.maxTotal,
    currentOptions.length,
    selectedCount,
  ]);

  const onSubmit = async (
    expensePayload: OnboardingCategoryOption[],
    incomePayload: OnboardingCategoryOption[],
  ) => {
    const expenseSelected = expensePayload.filter((c) => c.isSelected).length;
    const incomeSelected = incomePayload.filter((c) => c.isSelected).length;

    if (expenseSelected < CATEGORY_CONFIG.expense.minSelected) {
      showToast({
        title: "Almost there",
        description: `Select at least ${CATEGORY_CONFIG.expense.minSelected} expense categories to continue.`,
        type: "error",
      });
      return;
    }

    if (incomeSelected < CATEGORY_CONFIG.income.minSelected) {
      showToast({
        title: "Almost there",
        description: `Select at least ${CATEGORY_CONFIG.income.minSelected} income categories to continue.`,
        type: "error",
      });
      return;
    }
    const formattedPayload = {
      categoriesInfo: [...expensePayload, ...incomePayload].map((category) => ({
        title: category.label,
        value: category.value,
        active: category.isSelected,
        categoryType: category.categoryType,
      })),
    };

    try {
      setIsSubmitting(true);
      const { data } = await axiosInstance.post(
        "/onboarding/categories-info",
        formattedPayload,
      );
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
    handleMessageAndColor,
    canUnselectOrDelete,
    canSelectMore,
    canCreateCategory,
  };
};

export default useOnboardingCategoryInfo;
