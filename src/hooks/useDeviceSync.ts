import { useEffect, useRef } from 'react';
import { getDeviceInfo } from '@/lib/device';
import { getUserId, setUserId } from '@/lib/identity';
import { postWithRetry } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';

type UpsertResponse = { user?: { id?: string }; reused?: boolean };

/**
 * One-shot boot sync. Once stores are hydrated:
 *   1. Collect device info (IDFV/SSAID + locale/region/model/version).
 *   2. POST /api/users — server dedups by device_id and returns the row,
 *      updating last_opened_at (doubles as the cold-boot heartbeat).
 *   3. Persist the returned server id (Keychain + store) for later PATCHes.
 * Falls back to the cached Keychain id if the network call fails.
 * Fire-and-forget — never blocks the splash or UI.
 */
export function useDeviceSync(enabled: boolean): void {
  const setServerUserId = useUserStore((s) => s.setServerUserId);
  const ran = useRef(false);

  useEffect(() => {
    if (!enabled || ran.current) return;
    ran.current = true;

    void (async () => {
      try {
        const cachedId = await getUserId();
        if (cachedId) setServerUserId(cachedId);

        const info = await getDeviceInfo();
        if (!info.device_id) return; // no stable id → skip server upsert

        const resp = await postWithRetry<UpsertResponse>('/api/users', info);
        const serverId = resp?.user?.id ?? cachedId;
        if (serverId) {
          await setUserId(serverId);
          setServerUserId(serverId);
        }
      } catch {
        // non-fatal — local-first app keeps working offline
      }
    })();
  }, [enabled, setServerUserId]);
}
