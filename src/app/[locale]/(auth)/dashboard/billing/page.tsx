import { unstable_setRequestLocale } from 'next-intl/server';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { PricingInformation } from '@/features/billing/PricingInformation';
import { PLAN_ID } from '@/utils/AppConfig';

const BillingPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);

  const buttonList = {
    [PLAN_ID.FREE]: <a href="/en/dashboard" className="w-full block text-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Current Plan</a>,
    [PLAN_ID.PREMIUM]: <a href="https://buy.stripe.com/test_pro" className="w-full block text-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Upgrade to Pro</a>,
    [PLAN_ID.ENTERPRISE]: <a href="https://buy.stripe.com/test_enterprise" className="w-full block text-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Upgrade to Enterprise</a>,
  };

  return (
    <>
      <TitleBar
        title="Billing"
        description="Manage your billing and subscription"
      />
      <PricingInformation buttonList={buttonList} />
    </>
  );
};

export default BillingPage;