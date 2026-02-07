import * as SecureStore from "expo-secure-store";

export const setSecureStoreKey = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export const getSecureStoreKey = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};

export const deleteSecureStoreKey = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};
