import React from 'react';
import { Layout } from 'src/components/Layout';

export const LayoutBackOffice = ({
  children,
  title = 'Espace personnel',
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <Layout title={`${title} - LinkedOut`} noIndex isBackoffice>
      {children}
    </Layout>
  );
};
