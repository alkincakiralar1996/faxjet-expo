import { useRouter } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import { PrimingScreen } from '@/components/faxjet/PrimingScreen';
import { PrimingCameraArt } from '@/components/illustrations/PrimingCameraArt';
import { useSendDraftStore } from '@/stores/sendDraftStore';

export default function PermissionCamera() {
  const router = useRouter();
  const [, requestPermission] = useCameraPermissions();
  const startDraft = useSendDraftStore((s) => s.startDraft);

  const onAllow = async () => {
    const res = await requestPermission();
    if (res?.granted) {
      startDraft('camera');
      router.replace('/(app)/(tabs)/(home)/send/camera');
    } else {
      router.replace('/(app)/(tabs)/(home)/send/permission-denied');
    }
  };

  return (
    <PrimingScreen
      illustration={<PrimingCameraArt />}
      headline="Scan documents with your camera."
      body="FaxJet uses your camera only when you tap Scan. We never store images on our servers — they're sent only to your fax recipient."
      allowLabel="Allow Camera Access"
      onAllow={onAllow}
    />
  );
}
