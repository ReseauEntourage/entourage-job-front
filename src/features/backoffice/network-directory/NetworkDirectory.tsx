import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Section } from '@/src/components/ui';
import { HeaderBackoffice } from '../../headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from '../../headers/HeaderBackoffice/HeaderBackoffice.styles';
import {
  StyledNetworkDirectoryContainer,
  StyledNetworkDirectoryHeader,
} from './NetworkDirectory.styles';
import { NetworkDirectoryFilters } from './NetworkDirectoryFilters/NetworkDirectoryFilters';
import { NetworkDirectoryList } from './NetworkDirectoryList';

export const NetworkDirectory = () => {
  return (
    <LayoutBackOffice title="Annuaire">
      <StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <StyledNetworkDirectoryHeader>
            <HeaderBackoffice
              title="Bienvenue sur votre réseau"
              description="Découvrez les membres de la communauté, nos entreprises partenaires et développez votre carnet d'adresse."
              noSeparator
            />
            <NetworkDirectoryFilters />
          </StyledNetworkDirectoryHeader>
        </Section>
      </StyledBackgroundedHeaderBackoffice>
      <Section className="custom-page">
        <StyledNetworkDirectoryContainer>
          <NetworkDirectoryList />
        </StyledNetworkDirectoryContainer>
      </Section>
    </LayoutBackOffice>
  );
};
