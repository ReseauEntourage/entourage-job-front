import React from 'react';
import { ProfileContactCard } from '../../profile/ProfilePartCards/ProfileContactCard';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { HeaderProfile } from 'src/components/headers/HeaderProfile/HeaderProfile';
import { ProfileContactPreferences } from 'src/components/profile/ProfilePartCards/ProfileContactPreferences/ProfileContactPreferences';
import { ProfileContracts } from 'src/components/profile/ProfilePartCards/ProfileContracts/ProfileContracts';
import { ProfileCustomHelpsAndOffers } from 'src/components/profile/ProfilePartCards/ProfileCustomHelpsAndOffers/ProfileCustomHelpsAndOffers';
import { ProfileDocuments } from 'src/components/profile/ProfilePartCards/ProfileDocuments/ProfileDocuments';
import { ProfileExperiences } from 'src/components/profile/ProfilePartCards/ProfileExperiences/ProfileExperiences';
import { ProfileFormations } from 'src/components/profile/ProfilePartCards/ProfileFormations/ProfileFormations';
import { ProfileHelpsAndOffers } from 'src/components/profile/ProfilePartCards/ProfileHelpsAndOffers/ProfileHelpsAndOffers';
import { ProfileInterests } from 'src/components/profile/ProfilePartCards/ProfileInterests/ProfileInterests';
import { ProfileLanguages } from 'src/components/profile/ProfilePartCards/ProfileLanguages/ProfileLanguages';
import { ProfileProfessionalInformations } from 'src/components/profile/ProfilePartCards/ProfileProfessionalInformations/ProfileProfessionalInformations';
import { ProfileReviews } from 'src/components/profile/ProfilePartCards/ProfileReviews/ProfileReviews';
import { Section } from 'src/components/utils';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledProfileLeftColumn,
  StyledProfileRightColumn,
} from './Profile.styles';
import { useSelectSelectedProfile } from './useSelectedProfile';

export const Profile = () => {
  const isDesktop = useIsDesktop();
  const selectedProfile = useSelectSelectedProfile();
  const description =
    'Je m’appelle Julien Petit, j’ai 47 ans et je suis un professionnel expérimenté dans les domaines de la vente, du service client et du tourisme. Désireux de relever de nouveaux défis, je m’appuie sur une solide expérience en gestion administrative, développement commercial et relation client.Au fil de ma carrière, j’ai occupé divers postes tels qu’agent de voyages, réceptionniste et commercial sédentaire, ce qui m’a permis de développer une grande polyvalence. Je maîtrise la réservation, la gestion des dossiers ainsi que les stratégies commerciales, tout en veillant à offrir un excellent service après-vente.Bilingue en français et espagnol, je possède également une bonne connaissance de l’anglais, ce qui me permet d’évoluer dans des environnements multiculturels avec aisance.';

  return (
    <StyledBackofficeBackground>
      <HeaderProfile
        id={selectedProfile.id}
        isAvailable={selectedProfile.isAvailable}
        firstName={selectedProfile.firstName}
        lastName={selectedProfile.lastName}
        role={selectedProfile.role}
        department={selectedProfile.department}
        description={selectedProfile.description}
      />

      <Section className="custom-page">
        <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledProfileLeftColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <ProfileProfessionalInformations
              userFirstName={selectedProfile.firstName}
              ambitions={selectedProfile.searchAmbitions ?? []}
              businessLines={selectedProfile.searchBusinessLines ?? []}
              description={description}
              skills={[
                {
                  id: '1',
                  name: 'Gestion administrative et organisation',
                  CVs: [],
                  createdAt: '',
                  updatedAt: '',
                },
                {
                  id: '2',
                  name: 'Relation client et prospection commerciale',
                  CVs: [],
                  createdAt: '',
                  updatedAt: '',
                },
                {
                  id: '3',
                  name: 'Communication et coordination',
                  CVs: [],
                  createdAt: '',
                  updatedAt: '',
                },
              ]}
            />
            <ProfileCustomHelpsAndOffers
              items={['item1', 'item2']}
              firstName={selectedProfile.firstName}
              role={selectedProfile.role}
              id={selectedProfile.id}
              ownProfile
            />
            <ProfileExperiences
              userId={selectedProfile.id}
              userFirstName={selectedProfile.firstName}
              experiences={[]}
            />
            <ProfileFormations
              userId={selectedProfile.id}
              userFirstName={selectedProfile.firstName}
              formations={[]}
            />
            <ProfileReviews
              userId={selectedProfile.id}
              userFirstName={selectedProfile.firstName}
              reviews={[]}
            />
          </StyledProfileLeftColumn>
          <StyledProfileRightColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <ProfileContactCard userId={selectedProfile.id} />
            <ProfileContracts smallCard />
            <ProfileInterests smallCard />
            <ProfileLanguages languages={[]} smallCard />
            <ProfileDocuments
              userId={selectedProfile.id}
              linkedinUrl={selectedProfile.linkedinUrl}
              hasExternalCv={selectedProfile.hasExternalCv}
              entourageProCv="/url/" // TODO: Add CvUrl
              smallCard
            />
            <ProfileContactPreferences smallCard />
            <ProfileHelpsAndOffers role={selectedProfile.role} smallCard />
          </StyledProfileRightColumn>
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
