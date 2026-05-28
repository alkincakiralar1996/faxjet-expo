import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

/** Open a URL in an in-app Safari view (SFSafariViewController on iOS). */
export async function openExternal(url?: string | null): Promise<void> {
  if (!url) return;
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch {
    // fall back to the system browser
    try {
      await Linking.openURL(url);
    } catch {
      // non-fatal
    }
  }
}

/** Deep-link to this app's entry in the iOS Settings app. */
export async function openAppSettings(): Promise<void> {
  try {
    await Linking.openSettings();
  } catch {
    // non-fatal
  }
}
