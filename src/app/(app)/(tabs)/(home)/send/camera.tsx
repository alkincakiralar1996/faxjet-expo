import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { TopBar } from '@/components/ui/TopBar';
import { IconButton } from '@/components/ui/IconButton';
import { HapticPressable } from '@/components/ui/HapticPressable';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/icons/Icon';
import { colors } from '@/theme/tokens';
import { useSendDraftStore } from '@/stores/sendDraftStore';
import { openAppSettings } from '@/lib/links';
import { trigger } from '@/hooks/useHaptics';

export default function CameraScan() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const source = useSendDraftStore((s) => s.source);
  const startDraft = useSendDraftStore((s) => s.startDraft);
  const addPages = useSendDraftStore((s) => s.addPages);
  const pageCount = useSendDraftStore((s) => s.pageCount);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [busy, setBusy] = useState(false);

  // Fresh camera draft on first mount; request permission if not yet granted.
  useEffect(() => {
    if (source !== 'camera') startDraft('camera');
    if (permission && !permission.granted && permission.canAskAgain) {
      void requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capture = async () => {
    if (busy || !cameraRef.current) return;
    setBusy(true);
    trigger('heavy');
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        addPages([
          { uri: photo.uri, width: photo.width ?? 0, height: photo.height ?? 0 },
        ]);
      }
    } catch {
      // ignore a single failed capture
    } finally {
      setBusy(false);
    }
  };

  const goNext = () => {
    if (pageCount === 0) return;
    router.replace('/(app)/(tabs)/(home)/send/preview');
  };

  // Permission denied (can't ask again) — guide to Settings.
  if (permission && !permission.granted && !permission.canAskAgain) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.green900,
          paddingTop: insets.top,
        }}
      >
        <StatusBar style="light" />
        <TopBar
          dark
          left={<IconButton name="x" color="#FFFFFF" onPress={() => router.back()} />}
        />
        <View style={{ flex: 1, padding: 32, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <Icon name="camera" size={40} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
            Camera access is off
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, textAlign: 'center', lineHeight: 20 }}>
            Enable camera access in Settings to scan documents.
          </Text>
          <Button label="Open Settings" onPress={openAppSettings} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.green900, paddingTop: insets.top }}>
      <StatusBar style="light" />
      <TopBar
        dark
        left={<IconButton name="x" color="#FFFFFF" onPress={() => router.back()} />}
        center={<Text style={{ fontSize: 17, fontWeight: '600', color: '#FFFFFF' }}>Scan</Text>}
        right={
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.amber500, paddingRight: 12 }}>
            Auto
          </Text>
        }
      />

      <View
        style={{
          position: 'absolute',
          top: insets.top + 60,
          left: 16,
          right: 16,
          bottom: insets.bottom + 140,
          backgroundColor: '#0A1D14',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        {permission?.granted ? (
          <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
              Starting camera…
            </Text>
          </View>
        )}

        {/* Amber detection corners */}
        {[
          { top: 16, left: 16, borderTopWidth: 4, borderLeftWidth: 4 },
          { top: 16, right: 16, borderTopWidth: 4, borderRightWidth: 4 },
          { bottom: 16, left: 16, borderBottomWidth: 4, borderLeftWidth: 4 },
          { bottom: 16, right: 16, borderBottomWidth: 4, borderRightWidth: 4 },
        ].map((s, i) => (
          <View
            key={i}
            pointerEvents="none"
            style={{ position: 'absolute', width: 28, height: 28, borderColor: colors.amber500, ...(s as object) }}
          />
        ))}

        {/* Status pill */}
        <View style={{ position: 'absolute', top: 16, left: 0, right: 0, alignItems: 'center' }} pointerEvents="none">
          <View
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 9999,
              backgroundColor: 'rgba(255,176,32,0.15)',
              borderWidth: 1,
              borderColor: 'rgba(255,176,32,0.35)',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: colors.amber500 }} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.amber500 }}>
              Position the page in frame
            </Text>
          </View>
        </View>
      </View>

      {/* Shutter row */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: insets.bottom + 36,
          paddingHorizontal: 40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <HapticPressable
          haptic="light"
          onPress={goNext}
          accessibilityLabel="Done scanning"
          style={{ width: 64, alignItems: 'flex-start' }}
        >
          {pageCount > 0 ? (
            <Text style={{ color: colors.amber500, fontSize: 16, fontWeight: '600' }}>Next</Text>
          ) : (
            <Icon name="photo" size={28} color="rgba(255,255,255,0.4)" />
          )}
        </HapticPressable>

        <HapticPressable
          haptic="heavy"
          onPress={capture}
          accessibilityLabel="Capture page"
          style={{
            width: 76,
            height: 76,
            borderRadius: 9999,
            borderWidth: 4,
            borderColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
            opacity: busy ? 0.6 : 1,
          }}
        >
          <View style={{ width: '100%', height: '100%', borderRadius: 9999, backgroundColor: '#FFFFFF' }} />
        </HapticPressable>

        <View
          style={{
            width: 64,
            alignItems: 'flex-end',
          }}
        >
          <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999, backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
              {pageCount} {pageCount === 1 ? 'page' : 'pages'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
