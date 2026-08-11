import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import {
  Icon,
  CloseIcon,
  CheckCircleIcon,
  CircleIcon,
} from "@/components/ui/icon";
import {
  OnboardingCategoryBoxProps,
  CategoryPillProps,
  PillStyleSet,
  PillColorKey,
  PILL_COLOR_KEYS,
} from "@/utils/lib/types";

const PILL_STYLES: Record<PillColorKey, PillStyleSet> = {
  emerald: {
    pillSelected:
      "bg-emerald-100 border border-emerald-300/80 rounded-2xl px-3 py-2",
    pillUnselected:
      "bg-emerald-50/90 border border-emerald-200/60 rounded-2xl px-3 py-2",
    textSelected: "text-emerald-800 font-medium",
    textUnselected: "text-emerald-600",
    iconSelected: "text-emerald-600",
    iconUnselected: "text-emerald-500",
  },
  amber: {
    pillSelected:
      "bg-amber-100 border border-amber-300/80 rounded-2xl px-3 py-2",
    pillUnselected:
      "bg-amber-50/90 border border-amber-200/60 rounded-2xl px-3 py-2",
    textSelected: "text-amber-900 font-medium",
    textUnselected: "text-amber-700",
    iconSelected: "text-amber-600",
    iconUnselected: "text-amber-500",
  },
  sky: {
    pillSelected: "bg-sky-100 border border-sky-300/80 rounded-2xl px-3 py-2",
    pillUnselected:
      "bg-sky-50/90 border border-sky-200/60 rounded-2xl px-3 py-2",
    textSelected: "text-sky-800 font-medium",
    textUnselected: "text-sky-600",
    iconSelected: "text-sky-600",
    iconUnselected: "text-sky-500",
  },
  indigo: {
    pillSelected:
      "bg-indigo-100 border border-indigo-300/70 rounded-2xl px-3 py-2",
    pillUnselected:
      "bg-indigo-50/80 border border-indigo-200/60 rounded-2xl px-3 py-2",
    textSelected: "text-indigo-800 font-medium",
    textUnselected: "text-indigo-600",
    iconSelected: "text-indigo-600",
    iconUnselected: "text-indigo-500",
  },
  mauve: {
    pillSelected:
      "bg-pink-100/70 border border-pink-300/60 rounded-2xl px-3 py-2",
    pillUnselected:
      "bg-pink-50/80 border border-pink-200/50 rounded-2xl px-3 py-2",
    textSelected: "text-pink-800 font-medium",
    textUnselected: "text-pink-700",
    iconSelected: "text-pink-700",
    iconUnselected: "text-pink-600",
  },
};

const COLOR_ORDER_PER_GROUP: readonly (readonly number[])[] = [
  [0, 1, 2, 3, 4],
  [2, 4, 1, 0, 3],
  [4, 3, 0, 2, 1],
  [1, 0, 3, 4, 2],
  [3, 2, 4, 1, 0],
];

const getPillColorKey = (index: number): PillColorKey => {
  const group = Math.floor(index / 5);
  const posInGroup = index % 5;
  const order = COLOR_ORDER_PER_GROUP[group % COLOR_ORDER_PER_GROUP.length];
  return PILL_COLOR_KEYS[order[posInGroup]];
};

const getPillClasses = (styleSet: PillStyleSet, isSelected: boolean) => {
  return {
    pillClass: isSelected ? styleSet.pillSelected : styleSet.pillUnselected,
    textClass: isSelected ? styleSet.textSelected : styleSet.textUnselected,
    iconClass: isSelected ? styleSet.iconSelected : styleSet.iconUnselected,
  };
};

const CategoryPill = ({
  category,
  index,
  canUnselectOrDelete,
  canSelectMore,
  onSelect,
  onUnselect,
  onDelete,
}: CategoryPillProps) => {
  const canToggle = category.isSelected ? canUnselectOrDelete : canSelectMore;
  const canDelete = !category.isSelected || canUnselectOrDelete;

  const colorKey = getPillColorKey(index);
  const styleSet = PILL_STYLES[colorKey];
  const { pillClass, textClass, iconClass } = getPillClasses(
    styleSet,
    category.isSelected,
  );

  const handleToggle = () => {
    if (category.isSelected) onUnselect(category);
    else onSelect(category);
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      activeOpacity={0.7}
      className={`flex flex-row items-center gap-2 ${pillClass}`}
    >
      <View
        className={`flex flex-row items-center gap-2 ${!canToggle && "opacity-60"}`}
      >
        <Icon
          as={category.isSelected ? CheckCircleIcon : CircleIcon}
          size="sm"
          className={iconClass}
        />
        <Text className={textClass}>{category.label}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onDelete(category)}
        hitSlop={8}
        className={`ml-2 ${!canDelete && "opacity-60"}`}
        activeOpacity={0.7}
      >
        <Icon as={CloseIcon} size="sm" className="text-slate-500" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const OnboardingCategoryBox = ({
  categoryOptions,
  handleDeleteCategory,
  handleSelectCategory,
  handleUnselectCategory,
  handleAddCategory,
  canUnselectOrDelete,
  canSelectMore,
  canCreateCategory,
}: OnboardingCategoryBoxProps) => {
  return (
    <View className="flex-1 min-h-[350px] max-h-[40vh] w-full bg-background-50 rounded-lg p-4">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
        }}
        className="flex-1"
      >
        {categoryOptions.map((category, index) => (
          <CategoryPill
            key={category.value}
            category={category}
            index={index}
            canUnselectOrDelete={canUnselectOrDelete}
            canSelectMore={canSelectMore}
            onSelect={handleSelectCategory}
            onUnselect={handleUnselectCategory}
            onDelete={handleDeleteCategory}
          />
        ))}
      </ScrollView>
      <View className="flex flex-row items-center justify-end gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="border border-primary-400 disabled:opacity-70"
          onPress={handleAddCategory}
          disabled={!canCreateCategory}
        >
          <ButtonText>Add Category</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default OnboardingCategoryBox;
