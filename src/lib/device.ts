import * as Application from 'expo-application';
import * as Device from 'expo-device';
import * as Localization from 'expo-localization';
import { Platform } from 'react-native';

// Stable per-device id so the backend dedups users across reinstalls:
//   iOS    → identifierForVendor (survives while any vendor app stays
//            installed; Keychain-backed userId covers the full-wipe edge)
//   Android → Settings.Secure.ANDROID_ID (SSAID), stable per signing key
let cachedDeviceId: string | null | undefined;

export async function getDeviceId(): Promise<string | null> {
  if (cachedDeviceId !== undefined) return cachedDeviceId;
  try {
    if (Platform.OS === 'ios') {
      cachedDeviceId = await Application.getIosIdForVendorAsync();
    } else if (Platform.OS === 'android') {
      cachedDeviceId = Application.getAndroidId();
    } else {
      cachedDeviceId = null;
    }
  } catch {
    cachedDeviceId = null;
  }
  return cachedDeviceId;
}

export type DeviceInfo = {
  platform: string;
  device_id: string | null;
  device_model: string | null;
  device_model_name: string | null;
  os_version: string | null;
  locale: string | null;
  region: string | null;
  timezone: string | null;
  app_version: string;
};

export async function getDeviceInfo(): Promise<DeviceInfo> {
  const locale = Localization.getLocales()[0];
  const calendar = Localization.getCalendars()[0];
  const deviceId = await getDeviceId();
  return {
    platform: Platform.OS,
    device_id: deviceId,
    device_model: Device.modelId ?? null,
    device_model_name: Device.modelName ?? null,
    os_version: Device.osVersion ?? null,
    locale: locale?.languageTag ?? null,
    region: locale?.regionCode ?? null,
    timezone: calendar?.timeZone ?? null,
    app_version: Application.nativeApplicationVersion ?? 'unknown',
  };
}
