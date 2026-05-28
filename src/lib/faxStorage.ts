import * as FileSystem from 'expo-file-system/legacy';

// Fax PAGE files live on the device only — never uploaded to our server.
// Layout: <documentDirectory>faxes/<faxId>/page-1.jpg, page-2.jpg, …
// After a delete+reinstall the directory is gone, so getPages() returns [] and
// the detail screen shows a "pages were on your previous device" placeholder.

const ROOT = `${FileSystem.documentDirectory}faxes/`;

function dirFor(faxId: string): string {
  return `${ROOT}${faxId}/`;
}

async function ensureDir(path: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  }
}

function guessExt(uri: string): string {
  const clean = uri.split('?')[0] ?? uri;
  const m = clean.match(/\.(\w{2,5})$/);
  return (m?.[1] ?? 'jpg').toLowerCase();
}

function pageNum(name: string): number {
  const m = name.match(/page-(\d+)/);
  return m ? Number(m[1]) : 0;
}

/**
 * Copy captured/picked source URIs into the fax's private device directory.
 * Returns the local file URIs. Best-effort: a source that can't be copied is
 * skipped rather than failing the whole save.
 */
export async function savePages(
  faxId: string,
  sourceUris: string[],
): Promise<string[]> {
  const dir = dirFor(faxId);
  await ensureDir(dir);
  const saved: string[] = [];
  for (let i = 0; i < sourceUris.length; i++) {
    const src = sourceUris[i];
    if (!src) continue;
    const dest = `${dir}page-${i + 1}.${guessExt(src)}`;
    try {
      await FileSystem.copyAsync({ from: src, to: dest });
      saved.push(dest);
    } catch {
      // skip un-copyable source
    }
  }
  return saved;
}

/** Local page URIs for a fax, ordered page-1..N. Empty if none on this device. */
export async function getPages(faxId: string): Promise<string[]> {
  const dir = dirFor(faxId);
  try {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) return [];
    const names = await FileSystem.readDirectoryAsync(dir);
    return names
      .filter((n) => n.startsWith('page-'))
      .sort((a, b) => pageNum(a) - pageNum(b))
      .map((n) => `${dir}${n}`);
  } catch {
    return [];
  }
}

export async function deletePages(faxId: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(dirFor(faxId), { idempotent: true });
  } catch {
    // non-fatal
  }
}
