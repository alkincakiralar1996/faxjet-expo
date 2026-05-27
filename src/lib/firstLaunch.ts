import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const MARKER_KEY = 'faxjet.installed';
const LEGACY_SECURE_KEYS = ['faxjet.user', 'faxjet.subscription'];

/**
 * iOS Keychain entries survive app uninstall. AsyncStorage does not.
 * On fresh install we detect the missing marker and wipe any Keychain
 * residue (legacy SecureStore stores) before stores hydrate.
 */
export async function ensureFirstLaunchClean(): Promise<void> {
  try {
    const seen = await AsyncStorage.getItem(MARKER_KEY);
    if (seen === '1') return;
    await Promise.all(
      LEGACY_SECURE_KEYS.map((k) =>
        SecureStore.deleteItemAsync(k).catch(() => {}),
      ),
    );
    await AsyncStorage.setItem(MARKER_KEY, '1');
  } catch {
    // ignore — non-fatal
  }
}
