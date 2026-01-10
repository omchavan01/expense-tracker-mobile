import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { CircleIcon, CloseIcon, Icon } from "@/components/ui/icon";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { useHaptics } from "@/utils/lib/haptics";
import { DropdownSheetProps } from "@/utils/lib/types";

const DropdownSheet = <T,>({
  title,
  bottomSheetRef,
  options = [],
  snapPointsList = ["25%", "50%", "75%"],
  selectedValue,
  onSelect,
  scrollEnabled = true,
}: DropdownSheetProps<T>) => {
  const { impactHaptics } = useHaptics();
  const snapPoints = useMemo(() => snapPointsList, [snapPointsList]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const handleOptionSelect = useCallback(
    (value: T) => {
      impactHaptics("light");
      onSelect(value);
      bottomSheetRef.current?.close();
    },
    [onSelect, bottomSheetRef, impactHaptics]
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      enablePanDownToClose={false}
      enableDynamicSizing={false}
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={scrollEnabled}
      >
        <View className="flex flex-row justify-between items-center mb-10">
          <Text className="text-lg font-medium">{title}</Text>
          <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
            <Icon as={CloseIcon} size="xl" />
          </TouchableOpacity>
        </View>
        <RadioGroup className="gap-4">
          {options.map((option) => {
            const isSelected = selectedValue === option.value;
            return (
              <View
                key={option.value}
                className={`
                flex-row items-center rounded-xl
                ${isSelected ? "bg-primary-50 border border-primary-200" : "bg-background-0 border border-outline-100"}
                `}
              >
                <Radio
                  value={option.value}
                  data-checked={isSelected}
                  onPress={() => handleOptionSelect(option.value as T)}
                  className="flex-1 px-4 py-4"
                >
                  <RadioIndicator className="mr-2 ">
                    <RadioIcon as={CircleIcon} size="sm" />
                  </RadioIndicator>
                  <RadioLabel
                    className={` text-base flex-1 ${isSelected && "font-medium"}`}
                  >
                    {option.label}
                  </RadioLabel>
                </Radio>
              </View>
            );
          })}
        </RadioGroup>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default DropdownSheet;
