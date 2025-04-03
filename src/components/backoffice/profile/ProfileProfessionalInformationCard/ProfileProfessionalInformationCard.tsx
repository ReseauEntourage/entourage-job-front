import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import MaletteIllu from 'assets/icons/illu-malette.svg';
import { ProfilePlaceHolder } from '../ProfilePlaceholder';
import { useSelectSelectedProfile } from '../useSelectedProfile';
import { StyledProfessionalInformationList } from 'src/components/backoffice/parametres-old/ParametresLayout/ProfessionalInformationCard/ProfessionalInformationCard.styles';
import { checkData } from 'src/components/backoffice/parametres-old/ParametresLayout/ProfessionalInformationCard/ProfessionalInformationCard.utils';
import { Button, Card } from 'src/components/utils';
import { H5 } from 'src/components/utils/Headings';
import { Tag } from 'src/components/utils/Tag';
import { BUSINESS_SECTORS } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { USER_ROLES } from 'src/constants/users';
import { gaEvent } from 'src/lib/gtag';
import { findConstantFromValue, sortByOrder } from 'src/utils';
import { ProfileCareerPathSentence } from './ProfileCareerPathSentence';

const uuidValue = uuid();

export const ProfileProfessionalInformationCard = () => {
  const selectedProfile = useSelectSelectedProfile();
  const [hasData, setHasData] = useState<boolean>(false);

  useEffect(() => {
    if (selectedProfile) {
      setHasData(
        checkData({
          role: selectedProfile.role,
          currentJob: selectedProfile.currentJob,
          occupations: selectedProfile.occupations,
          businessSectors: selectedProfile.businessSectors,
        })
      );
    }
  }, [selectedProfile]);

  return (
    <Card title="Informations professionnelles">
      {!hasData ? (
        <ProfilePlaceHolder
          image={<MaletteIllu />}
          description="Ces informations n’ont pas encore été renseigné"
        />
      ) : (
        <StyledProfessionalInformationList>
          {selectedProfile.role === USER_ROLES.COACH ? (
            <>
              {selectedProfile.currentJob && (
                <li>
                  Je travaille comme{' '}
                  <strong>{selectedProfile.currentJob}</strong>
                </li>
              )}
              {selectedProfile.businessSectors &&
                selectedProfile.businessSectors.length > 0 && (
                  <li className="tag-container">
                    J&lsquo;ai du réseau dans :{' '}
                    {sortByOrder(selectedProfile.businessSectors).map(
                      ({ value }) => (
                        <Tag
                          key={uuidValue}
                          content={
                            findConstantFromValue(value, BUSINESS_SECTORS).label
                          }
                        />
                      )
                    )}
                  </li>
                )}
            </>
          ) : (
            <>
              <ProfileCareerPathSentence
                occupations={selectedProfile.occupations}
                businessSectors={selectedProfile.businessSectors}
              />
            </>
          )}
          {selectedProfile.linkedinUrl && (
            <>
              <H5 title="Mon profil Linkedin" />
              <Button
                href={selectedProfile.linkedinUrl}
                onClick={() => {
                  gaEvent(GA_TAGS.BACKOFFICE_MEMBER_PROFILE_LINKDIN_CLIC);
                }}
                isExternal
                newTab
                style="custom-primary-inverted"
              >
                Voir mon profil Linkedin
              </Button>
            </>
          )}
        </StyledProfessionalInformationList>
      )}
    </Card>
  );
};
