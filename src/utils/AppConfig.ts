import type { LocalePrefix } from 'node_modules/next-intl/dist/types/src/routing/types';

import { BILLING_INTERVAL, type PricingPlan } from '@/types/Subscription';

const localePrefix: LocalePrefix = 'as-needed';

export const AppConfig = {
  name: 'ToyuguoSec',
  locales: [
    {
      id: 'en',
      name: 'English',
    },
    {
      id: 'zh',
      name: '中文',
    },
    {
      id: 'ja',
      name: '日本語',
    },
  ],
  defaultLocale: 'en',
  localePrefix,
};

export const AllLocales = AppConfig.locales.map(locale => locale.id);

export const PLAN_ID = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;

export const PricingPlanList: Record<string, PricingPlan> = {
  [PLAN_ID.FREE]: {
    id: PLAN_ID.FREE,
    price: 0,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: '',
    devPriceId: '',
    prodPriceId: '',
    features: {
      teamMember: 1,
      website: 3,
      storage: 3,
      transfer: 3,
    },
  },
  [PLAN_ID.PREMIUM]: {
    id: PLAN_ID.PREMIUM,
    price: 49,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: 'price_premium_test',
    devPriceId: 'price_1TCZlpRq21BIRPfFmiPPMuIH',
    prodPriceId: '',
    features: {
      teamMember: 10,
      website: 20,
      storage: 20,
      transfer: 20,
    },
  },
  [PLAN_ID.ENTERPRISE]: {
    id: PLAN_ID.ENTERPRISE,
    price: 299,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: 'price_enterprise_test',
    devPriceId: 'price_1TCZmLRq21BIRPfFUKlF8IdQ',
    prodPriceId: 'price_123',
    features: {
      teamMember: 999,
      website: 999,
      storage: 999,
      transfer: 999,
    },
  },
};
