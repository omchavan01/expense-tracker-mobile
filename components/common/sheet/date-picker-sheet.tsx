import React, { useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Icon, CloseIcon } from "@/components/ui/icon";
import { DatePickerSheetProps } from "@/utils/lib/types";

const DatePickerSheet = ({
  bottomSheetRef,
  value,
  minDOB,
  maxDOB,
  onChange,
}: DatePickerSheetProps) => {
  const snapPoints = useMemo(() => ["40%"], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
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
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <Text className="flex-1 text-lg font-medium">Select Date</Text>
          <TouchableOpacity
            onPress={() => bottomSheetRef.current?.close()}
            className="rounded-full bg-gray-300 p-2"
          >
            <Icon as={CloseIcon} size="xl" />
          </TouchableOpacity>
        </View>

        <DateTimePicker
          mode="date"
          display="spinner"
          className="bg-black"
          value={value}
          minimumDate={minDOB}
          maximumDate={maxDOB}
          textColor="#000000"
          onChange={(event, selectedDate) => {
            onChange(event, selectedDate);
            bottomSheetRef.current?.close();
          }}
        />
      </View>
    </BottomSheet>
  );
};

export default DatePickerSheet;
