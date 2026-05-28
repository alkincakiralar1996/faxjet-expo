import { Image } from 'expo-image';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { TopBar } from '@/components/ui/TopBar';
import { IconButton } from '@/components/ui/IconButton';
import { Icon } from '@/icons/Icon';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/tokens';
import { useFaxStore } from '@/stores/faxStore';
import { formatLongTimestamp, formatPhoneDisplay } from '@/lib/format';
import type { Fax } from '@/types/fax';

function receiptHtml(fax: Fax): string {
  const row = (k: string, v: string) =>
    `<tr><td class="k">${k}</td><td class="v">${v}</td></tr>`;
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>
    body{font-family:-apple-system,Helvetica,Arial,sans-serif;color:#0A0A0A;padding:40px}
    .head{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #F3F4F6;padding-bottom:18px}
    h1{font-size:22px;margin:0}.muted{color:#6B7280;font-size:12px}
    .badge{background:#E8F5EF;color:#10B981;font-weight:700;font-size:12px;letter-spacing:.6px;padding:5px 12px;border-radius:999px}
    .label{color:#6B7280;font-size:12px;letter-spacing:.8px;font-weight:700;margin-top:22px}
    .conf{font-family:Menlo,monospace;font-size:28px;font-weight:700;margin:6px 0 18px}
    table{width:100%;border-collapse:collapse;font-size:14px}
    td{padding:10px 0;border-bottom:1px solid #F3F4F6}td.k{color:#6B7280}td.v{text-align:right;font-weight:700}
    .foot{margin-top:22px;background:#E8F5EF;color:#1B5E47;padding:12px 14px;border-radius:8px;font-size:12px}
  </style></head><body>
    <div class="head"><div><h1>FaxJet</h1><div class="muted">Delivery Receipt</div></div><span class="badge">DELIVERED</span></div>
    <div class="label">CONFIRMATION NUMBER</div>
    <div class="conf">${fax.confirmationNumber ?? '—'}</div>
    <table>
      ${row('Recipient', formatPhoneDisplay(fax.recipientNumber))}
      ${row('Sent at', formatLongTimestamp(fax.sentAt))}
      ${row('Delivered at', fax.deliveredAt ? formatLongTimestamp(fax.deliveredAt) : '—')}
      ${row('Transmission', fax.durationSeconds ? `${fax.durationSeconds} seconds` : '—')}
      ${row('Pages', String(fax.pages))}
      ${row('Cover page', fax.cover ? 'Included' : 'Not included')}
      ${row('Resolution', 'Fine (200 dpi)')}
    </table>
    <div class="foot">Transmitted via HIPAA-compliant fax gateway · 256-bit encrypted</div>
  </body></html>`;
}

export default function PDFReceipt() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const fax = useFaxStore((s) => s.getById(id));

  if (!fax) {
    return null;
  }

  const sharePdf = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: receiptHtml(fax) });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          UTI: 'com.adobe.pdf',
          dialogTitle: 'FaxJet receipt',
        });
      }
    } catch {
      // user cancelled or print failed
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.gray50,
        paddingTop: insets.top,
      }}
    >
      <TopBar
        left={<IconButton name="chevron-left" onPress={() => router.back()} />}
        center={
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.black }}>
            Delivery Receipt
          </Text>
        }
        right={<IconButton name="share" color={colors.green700} onPress={sharePdf} />}
      />

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            borderWidth: 1,
            borderColor: colors.gray100,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 18,
              borderBottomWidth: 1,
              borderBottomColor: colors.gray100,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Image
                source={require('@/assets/images/icon.png')}
                style={{ width: 32, height: 32, borderRadius: 8 }}
              />
              <View>
                <Text
                  style={{ fontSize: 16, fontWeight: '700', color: colors.black }}
                >
                  FaxJet
                </Text>
                <Text style={{ fontSize: 11, color: colors.gray500 }}>
                  Delivery Receipt
                </Text>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 9999,
                backgroundColor: colors.green100,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: colors.success,
                  letterSpacing: 0.66,
                }}
              >
                DELIVERED
              </Text>
            </View>
          </View>

          {/* Big check */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingVertical: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.gray100,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 9999,
                backgroundColor: colors.green100,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="check" size={28} color={colors.success} />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>
                Fax delivered successfully
              </Text>
              <Text style={{ fontSize: 13, color: colors.gray500 }}>
                {fax.deliveredAt
                  ? formatLongTimestamp(fax.deliveredAt)
                  : formatLongTimestamp(fax.sentAt)}
              </Text>
            </View>
          </View>

          {/* Confirmation */}
          <View
            style={{
              paddingVertical: 18,
              borderBottomWidth: 1,
              borderBottomColor: colors.gray100,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: colors.gray500,
                letterSpacing: 0.78,
                marginBottom: 6,
              }}
            >
              CONFIRMATION NUMBER
            </Text>
            <Text
              style={{
                fontFamily: 'Menlo',
                fontSize: 24,
                fontWeight: '700',
                color: colors.black,
                letterSpacing: 0.5,
              }}
            >
              {fax.confirmationNumber ?? 'FX-00000-XXX'}
            </Text>
          </View>

          {/* Details */}
          <View style={{ paddingTop: 18, gap: 12 }}>
            {[
              ['Recipient', formatPhoneDisplay(fax.recipientNumber)],
              ['Sent at', formatLongTimestamp(fax.sentAt)],
              [
                'Delivered at',
                fax.deliveredAt ? formatLongTimestamp(fax.deliveredAt) : '—',
              ],
              [
                'Transmission',
                fax.durationSeconds ? `${fax.durationSeconds} seconds` : '—',
              ],
              ['Pages', String(fax.pages)],
              ['Cover page', fax.cover ? 'Included' : 'Not included'],
              ['Resolution', 'Fine (200 dpi)'],
            ].map(([k, v]) => (
              <View
                key={k}
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <Text style={{ fontSize: 13, color: colors.gray500 }}>{k}</Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: colors.black,
                    maxWidth: '65%',
                    textAlign: 'right',
                  }}
                >
                  {v}
                </Text>
              </View>
            ))}
          </View>

          {/* Page thumbs */}
          <View
            style={{
              marginTop: 20,
              paddingTop: 18,
              borderTopWidth: 1,
              borderTopColor: colors.gray100,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: colors.gray500,
                letterSpacing: 0.78,
                marginBottom: 10,
              }}
            >
              PAGES SENT · {fax.pages}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {Array.from({ length: Math.min(fax.pages, 6) }).map((_, p) => (
                <View
                  key={p}
                  style={{
                    width: 64,
                    height: 84,
                    backgroundColor: colors.gray50,
                    borderWidth: 0.5,
                    borderColor: colors.gray300,
                    borderRadius: 6,
                    padding: 6,
                    position: 'relative',
                  }}
                >
                  {[100, 60, 80, 50, 70, 40].map((w, i) => (
                    <View
                      key={i}
                      style={{
                        height: 2,
                        marginBottom: 3,
                        backgroundColor: colors.gray500,
                        borderRadius: 1,
                        width: `${w}%`,
                      }}
                    />
                  ))}
                  <Text
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      right: 4,
                      fontSize: 8,
                      color: colors.gray500,
                    }}
                  >
                    p.{p + 1}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* HIPAA footer */}
          <View
            style={{
              marginTop: 18,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: colors.green100,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icon name="lock-shield" size={14} color={colors.green700} />
            <Text style={{ fontSize: 11, color: colors.green700, flex: 1 }}>
              Transmitted via HIPAA-compliant fax gateway · 256-bit encrypted
            </Text>
          </View>
        </View>
      </ScrollView>

      <BlurView
        intensity={28}
        tint="light"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: 20,
          paddingBottom: insets.bottom + 16,
          backgroundColor: 'rgba(250,250,247,0.78)',
          borderTopWidth: 0.5,
          borderTopColor: colors.gray100,
          gap: 10,
        }}
      >
        <Button label="Share Receipt" icon="share" onPress={sharePdf} />
        <Button kind="secondary" label="Save to Files" icon="download" onPress={sharePdf} />
      </BlurView>
    </View>
  );
}
