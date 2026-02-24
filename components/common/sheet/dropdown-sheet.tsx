import React, { useCallback, useMemo, useState } from "react";
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";

import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { CircleIcon, CloseIcon, Icon, SearchIcon } from "@/components/ui/icon";
import { Loader } from "@/components/common/loader";
import { DropdownOption, DropdownSheetProps } from "@/utils/lib/types";

const DropdownSheet = <T,>({
  title,
  bottomSheetRef,
  options = [],
  snapPointsList = ["25%", "50%", "75%"],
  selectedValue,
  onSelect,
  searchEnabled = false,
  isLoading = false,
}: DropdownSheetProps<T>) => {
  const snapPoints = useMemo(() => snapPointsList, [snapPointsList]);

  const [search, setSearch] = useState("");

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

  const handleOptionSelect = useCallback(
    (value: T) => {
      onSelect(value);
      bottomSheetRef.current?.close();
      if (Keyboard.isVisible()) Keyboard.dismiss();
      setSearch("");
    },
    [onSelect, bottomSheetRef, setSearch],
  );

  const filteredOptions = useMemo(() => {
    if (!search || search.trim() === "") {
      return options;
    }
    const searchLower = search.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchLower),
    );
  }, [options, search]);

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
      enableContentPanningGesture={false}
    >
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row justify-between items-center py-4">
          <Text className="text-lg font-medium flex-1">{title}</Text>
          <TouchableOpacity
            onPress={() => bottomSheetRef.current?.close()}
            className="p-2 bg-gray-300 rounded-full"
          >
            <Icon as={CloseIcon} size="xl" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        {searchEnabled && (
          <Input className="h-14 rounded-lg mt-2 mb-1 border border-outline-100">
            <InputSlot>
              <InputIcon as={SearchIcon} size="sm" className="left-2 mr-2" />
            </InputSlot>
            <InputField
              value={search}
              onChangeText={setSearch}
              placeholder="Search"
            />
            <InputSlot>
              <TouchableOpacity onPress={() => setSearch("")}>
                <InputIcon as={CloseIcon} size="sm" className="right-2 ml-2" />
              </TouchableOpacity>
            </InputSlot>
          </Input>
        )}
        {isLoading ? (
          <Loader />
        ) : (
          <ScrollView
            className="flex-1 mt-4"
            showsVerticalScrollIndicator={false}
          >
            <RadioGroup>
              <FlashList<DropdownOption>
                data={filteredOptions}
                keyExtractor={(item) => String(item.value)}
                extraData={selectedValue}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => {
                  const isSelected = selectedValue === item.value;
                  return (
                    <View
                      className={`
                    flex-row items-center rounded-xl mb-4
                    ${isSelected ? "bg-primary-50 border border-primary-200" : "border border-outline-50"}
                    `}
                    >
                      <Radio
                        value={String(item.value)}
                        data-checked={isSelected}
                        onPress={() => handleOptionSelect(item.value as T)}
                        className="flex-1 px-4 py-4"
                      >
                        <RadioIndicator
                          data-checked={isSelected}
                          className="mr-2"
                        >
                          <RadioIcon as={CircleIcon} size="sm" />
                        </RadioIndicator>
                        <RadioLabel
                          data-checked={isSelected}
                          className={`text-base flex-1 ${isSelected && "font-medium"}`}
                        >
                          {item.label}
                        </RadioLabel>
                      </Radio>
                    </View>
                  );
                }}
                ListEmptyComponent={() => {
                  return (
                    <Text className="text-center text-base text-typography-400">
                      No options found
                    </Text>
                  );
                }}
              />
            </RadioGroup>
          </ScrollView>
        )}
      </View>
    </BottomSheet>
  );
};

export default DropdownSheet;
