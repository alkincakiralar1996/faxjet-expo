import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from 'react-native-purchases';
import type { Plan } from '@/types/subscription';

// FaxJet's own RevenueCat iOS public SDK key (project-isolated from Prevena).
// Injected at build time; absent → RevenueCat disabled, gracefully.
const RC_KEY = process.env.EXPO_PUBLIC_RC_PUBLIC_KEY;

// The entitlement that unlocks sending. Configured on both products in RC.
export const ENTITLEMENT_ID = 'pro';

let configured = false;

export function isRevenueCatEnabled(): boolean {
  return !!RC_KEY && Platform.OS === 'ios';
}

/** Configure once at boot. No-op without a key / off-iOS. */
export function configureRevenueCat(): void {
  if (configured || !isRevenueCatEnabled()) return;
  try {
    if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.WARN);
    Purchases.configure({ apiKey: RC_KEY! });
    configured = true;
  } catch {
    // native module missing (e.g. running an old build) — stay disabled
  }
}

/** Alias the RC user to our server uuid so app_user_id == users.id. */
export async function identifyRevenueCat(userId: string): Promise<void> {
  if (!configured) return;
  try {
    await Purchases.logIn(userId);
  } catch {
    // non-fatal
  }
}

export function hasProEntitlement(info: CustomerInfo | null | undefined): boolean {
  return !!info && info.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

export function planFromProductId(productId: string | null | undefined): Plan | null {
  if (!productId) return null;
  if (productId.includes('weekly')) return 'weekly';
  if (productId.includes('monthly')) return 'monthly';
  return null;
}

export function planFromPackage(pkg: PurchasesPackage): Plan | null {
  const t = pkg.packageType;
  if (t === 'WEEKLY') return 'weekly';
  if (t === 'MONTHLY') return 'monthly';
  return planFromProductId(pkg.product.identifier);
}

export async function getCustomerInfoSafe(): Promise<CustomerInfo | null> {
  if (!configured) return null;
  try {
    return await Purchases.getCustomerInfo();
  } catch {
    return null;
  }
}

export async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  if (!configured) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current ?? null;
  } catch {
    return null;
  }
}

export type PurchaseResult =
  | { ok: true; info: CustomerInfo; pro: boolean }
  | { ok: false; cancelled: boolean };

export async function purchase(pkg: PurchasesPackage): Promise<PurchaseResult> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { ok: true, info: customerInfo, pro: hasProEntitlement(customerInfo) };
  } catch (e) {
    const cancelled =
      typeof e === 'object' && e !== null && 'userCancelled' in e
        ? Boolean((e as { userCancelled?: boolean }).userCancelled)
        : false;
    return { ok: false, cancelled };
  }
}

export async function restore(): Promise<CustomerInfo | null> {
  if (!configured) return null;
  try {
    return await Purchases.restorePurchases();
  } catch {
    return null;
  }
}

export { Purchases };
export type { CustomerInfo, PurchasesOffering, PurchasesPackage };
