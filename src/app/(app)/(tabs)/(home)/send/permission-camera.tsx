import { useRouter } from 'expo-router';
import { PrimingScreen } from '@/components/faxjet/PrimingScreen';
import { PrimingCameraArt } from '@/components/illustrations/PrimingCameraArt';

export default function PermissionCamera() {
  const router = useRouter();
  return (
    <PrimingScreen
      illustration={<PrimingCameraArt />}
      headline="Scan documents with your camera."
      body="FaxJet uses your camera only when you tap Scan. We never store images on our servers — they're sent only to your fax recipient."
      allowLabel="Allow Camera Access"
      onAllow={() => router.replace('/(app)/(tabs)/(home)/send/camera')}
    />
  );
}
