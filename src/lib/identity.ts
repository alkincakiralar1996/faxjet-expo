import * as SecureStore from 'expo-secure-store';

// Server-assigned user id, persisted in the Keychain so it survives a
// reinstall (fast reinstall recovery). The server still dedups by
// device_id, so a wiped Keychain just falls back to the device_id upsert.
const USER_ID_KEY = 'faxjet.user_id';

export async function getUserId(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(USER_ID_KEY);
  } catch {
    return null;
  }
}

export async function setUserId(id: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(USER_ID_KEY, id);
  } catch {
    // non-fatal
  }
}

export async function clearUserId(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(USER_ID_KEY);
  } catch {
    // non-fatal
  }
}
