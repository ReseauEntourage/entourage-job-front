import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Section } from '@/src/components/ui';
import { UserRoles } from '@/src/constants/users';
import { StyledBackofficeBackground } from '@/src/features/backoffice/Backoffice.styles';
import { CardDataInclusion } from '@/src/features/backoffice/ressources/aides-locales/CardDataInclusion';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';

const AidesLocales = () => {
  const user = useAuthenticatedUser();
  const contentByRole: {
    [key in UserRoles]?: { title: string; description: string };
  } & { default: { title: string; description: string } } = {
    [UserRoles.CANDIDATE]: {
      title: 'Aides locales',
      description:
        'Trouvez des aides près de chez vous pour faciliter votre parcours vers l’emploi',
    },
    default: {
      title: 'Aides locales',
      description:
        'Identifiez des services pour aider votre candidat à lever les freins qui peuvent ralentir son accès à l’emploi',
    },
  };

  const contents = user
    ? contentByRole[user?.role] || contentByRole.default
    : contentByRole.default;
  return (
    <LayoutBackOffice title="Aides locales">
      <Section className="custom-page">
        <HeaderBackoffice
          title={contents.title}
          description={contents.description}
          noSeparator
        />
      </Section>
      <StyledBackofficeBackground>
        <Section className="custom-page">
          <CardDataInclusion />
        </Section>
      </StyledBackofficeBackground>
    </LayoutBackOffice>
  );
};

export default AidesLocales;
