import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from '@/src/features/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { WizardFlowStepsSummary } from '@/src/features/registration-wizard/WizardFlowStepsSummary';
import { WizardSummary } from '@/src/features/registration-wizard/WizardSummary/WizardSummary';
import { WizardContentLayout } from '@/src/features/wizard-shell/WizardContentLayout';
import { selectCurrentUser } from '@/src/use-cases/current-user';
import { registrationActions } from '@/src/use-cases/registration';

const WizardHome = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [selectedFlows, setSelectedFlows] = useState<RegistrationFlow[]>([]);

  const { flow, companyName, invitationId } = router.query;

  useEffect(() => {
    if (!flow) {
      return;
    }
    dispatch(
      registrationActions.setStateFromQueryParams({
        flow: flow as RegistrationFlow,
        companyName: companyName as string | undefined,
        invitationId: invitationId as string | undefined,
      })
    );
    router.replace('/wizard/run');
  }, [flow, companyName, invitationId, dispatch, router]);

  if (currentUser) {
    router.replace('/backoffice/dashboard');
    return null;
  }

  const selectedFlow = selectedFlows[0] ?? null;

  return (
    <Layout title="Inscription — Entourage Pro" noFooter>
      <WizardContentLayout
        sidePanel={<WizardFlowStepsSummary flow={selectedFlow} />}
      >
        <StyledBackgroundedHeaderBackoffice>
          <Section className="custom-page">
            <HeaderBackoffice
              title="Rejoignez la communauté Entourage Pro"
              noSeparator
            />
          </Section>
        </StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <WizardSummary value={selectedFlows} onChange={setSelectedFlows} />
        </Section>
      </WizardContentLayout>
    </Layout>
  );
};

export default WizardHome;
