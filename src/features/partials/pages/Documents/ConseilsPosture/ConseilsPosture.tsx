import React, { useEffect } from 'react';
import { Section } from '@/src/components/ui';
import { EthicsCharter } from '@/src/components/ui/EthicsCharter/EthicsCharter';
import {
  READ_DOCUMENT_FIXED_CACHE_KEY,
  useReadDocumentMutation,
} from '@/src/use-cases/current-user';

export const ConseilsPosture = () => {
  const [, { reset: resetReadDocument }] = useReadDocumentMutation({
    fixedCacheKey: READ_DOCUMENT_FIXED_CACHE_KEY,
  });
  useEffect(() => {
    return () => {
      resetReadDocument();
    };
  }, [resetReadDocument]);
  return (
    <Section style="custom-primary">
      <EthicsCharter variant="page" />
    </Section>
  );
};
