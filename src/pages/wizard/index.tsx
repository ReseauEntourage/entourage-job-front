import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { WizardSummary } from '@/src/features/wizard/components/WizardSummary/WizardSummary';
import { WizardContentLayout } from '@/src/features/wizard/shell/WizardContentLayout';
import { WizardRoleSelectionSidePanel } from '@/src/features/wizard/sidepanels/WizardRoleSelectionSidePanel';
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
    <Layout title="Inscription — Entourage Pro" noFooter noHeader>
      <WizardContentLayout
        sidePanel={() => <WizardRoleSelectionSidePanel flow={selectedFlow} />}
        sidePanelSide="left"
      >
        <Section className="custom-page">
          <WizardSummary value={selectedFlows} onChange={setSelectedFlows} />
        </Section>
      </WizardContentLayout>
    </Layout>
  );
};

export default WizardHome;
