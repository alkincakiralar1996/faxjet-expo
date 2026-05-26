import { useLocalSearchParams } from 'expo-router';
import { PermissionDeniedView } from '@/components/faxjet/PermissionDeniedView';

type Kind = 'camera' | 'photo';

const CONFIG = {
  camera: {
    icon: 'camera' as const,
    headline: 'Allow camera access to scan documents.',
    body: 'FaxJet uses your camera to capture paper documents. We never store images on our servers — they\'re sent only to your fax recipient.',
  },
  photo: {
    icon: 'photo' as const,
    headline: 'Allow photo access to fax existing photos.',
    body: 'FaxJet needs to see the photos you choose to fax. We only access what you select — never your full library.',
  },
};

export default function PermissionDenied() {
  const { kind } = useLocalSearchParams<{ kind?: Kind }>();
  const cfg = CONFIG[(kind ?? 'camera') as Kind] ?? CONFIG.camera;
  return (
    <PermissionDeniedView
      icon={cfg.icon}
      headline={cfg.headline}
      body={cfg.body}
    />
  );
}
