import { useRouter } from 'expo-router';
import { PrimingScreen } from '@/components/faxjet/PrimingScreen';
import { PrimingPhotoArt } from '@/components/illustrations/PrimingPhotoArt';
import { useSendDraftStore } from '@/stores/sendDraftStore';

export default function PermissionPhoto() {
  const router = useRouter();
  const startDraft = useSendDraftStore((s) => s.startDraft);
  return (
    <PrimingScreen
      illustration={<PrimingPhotoArt />}
      headline="Send existing photos as faxes."
      body="FaxJet only accesses photos you select — never your full library. Pick the page you want to fax, we handle the rest."
      allowLabel="Allow Photo Access"
      onAllow={() => {
        startDraft('photo');
        router.replace('/(app)/(tabs)/(home)/send/preview');
      }}
    />
  );
}
