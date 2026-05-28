import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { PrimingScreen } from '@/components/faxjet/PrimingScreen';
import { PrimingPhotoArt } from '@/components/illustrations/PrimingPhotoArt';
import { useSendDraftStore } from '@/stores/sendDraftStore';

export default function PermissionPhoto() {
  const router = useRouter();
  const startDraft = useSendDraftStore((s) => s.startDraft);
  const setPages = useSendDraftStore((s) => s.setPages);

  const onAllow = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      router.replace('/(app)/(tabs)/(home)/send/permission-denied');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (res.canceled || res.assets.length === 0) {
      router.back();
      return;
    }
    startDraft('photo');
    setPages(
      res.assets.map((a) => ({
        uri: a.uri,
        width: a.width ?? 0,
        height: a.height ?? 0,
      })),
    );
    router.replace('/(app)/(tabs)/(home)/send/preview');
  };

  return (
    <PrimingScreen
      illustration={<PrimingPhotoArt />}
      headline="Send existing photos as faxes."
      body="FaxJet only accesses photos you select — never your full library. Pick the page you want to fax, we handle the rest."
      allowLabel="Choose Photos"
      onAllow={onAllow}
    />
  );
}
