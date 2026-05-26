import * as Haptics from 'expo-haptics';

export type HapticKind =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'error'
  | 'warning'
  | 'selection';

export function trigger(kind: HapticKind) {
  switch (kind) {
    case 'light':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    case 'medium':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    case 'heavy':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      return;
    case 'success':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    case 'error':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    case 'warning':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    case 'selection':
      Haptics.selectionAsync();
      return;
  }
}

export function useHaptics() {
  return { trigger };
}
