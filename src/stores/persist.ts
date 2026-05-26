import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { StateStorage } from 'zustand/middleware';

/**
 * SecureStore-backed adapter for small sensitive blobs (user + subscription state).
 * Falls back to AsyncStorage on web.
 */
export const secureStorage: StateStorage = {
  getItem: async (name) => {
    try {
      return (await SecureStore.getItemAsync(name)) ?? null;
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      // ignore — non-fatal during dev
    }
  },
  removeItem: async (name) => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      // ignore
    }
  },
};

/** AsyncStorage-backed adapter for the fax history. */
export const asyncStorage: StateStorage = {
  getItem: async (name) => (await AsyncStorage.getItem(name)) ?? null,
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};
