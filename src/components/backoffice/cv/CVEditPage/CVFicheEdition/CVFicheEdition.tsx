import React, { useCallback, useEffect, useState } from 'react';
import { CV } from 'src/api/types';
import { Grid, Img } from 'src/components/utils';

import { CV_STATUS } from 'src/constants';
import { AdminZone } from 'src/constants/departements';
import { useMount, usePrevious } from 'src/hooks/utils';
import {
  CVEditCareerPath,
  CVEditCatchphrase,
  CVEditPicture,
  CVEditReviews,
} from './CVEdit';
import { ExperiencesProfileCard } from './TimelineCard/ExperiencesProfileCard';
import { FormationsProfileCard } from './TimelineCard/FormationsProfileCard';
import {
  InfoProfileCard,
  PassionsCard,
  SkillsCard,
  StoryProfileCard,
} from './cards';

interface CVFicheEditionProps {
  cv: CV;
  onChange?: (
    updatedCV: Partial<CV>,
    updatedUserData?: Partial<{
      email: string;
      phone: string;
      address: string;
    }>
  ) => void;
  disablePicture?: boolean;
  email: string;
  phone?: string;
  previewGenerating: boolean;
  address: string;
  userZone: AdminZone;
}

export const CVFicheEdition = ({
  cv,
  onChange,
  disablePicture,
  previewGenerating,
  email,
  phone,
  address,
  userZone,
}: CVFicheEditionProps) => {
  const [previewUrl, setPreviewUrl] = useState(undefined);

  const [imageUrl, setImageUrl] = useState(undefined);

  const prevPreviewGenerating = usePrevious(previewGenerating);

  const updateImage = useCallback(() => {
    // Use hash to reload image if an update is done
    const previewHash = Date.now();
    const baseUrl = `${process.env.AWSS3_URL}${process.env.AWSS3_IMAGE_DIRECTORY}${cv.UserId}.${cv.status}`;
    setPreviewUrl(
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      `${baseUrl}.preview.jpg?${previewHash}`
    );
    setImageUrl(
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      `${baseUrl}.jpg?${previewHash}`
    );
  }, [cv.UserId, cv.status]);

  useMount(() => {
    updateImage();
  });

  useEffect(() => {
    if (!!prevPreviewGenerating && !previewGenerating) {
      updateImage();
    }
  }, [prevPreviewGenerating, previewGenerating, updateImage]);
  return (
    <Grid childWidths={['1-1']}>
      <Grid childWidths={['1-1']} match>
        <Grid childWidths={['1-2@s']} row match>
          <CVEditPicture
            imageUploading={previewGenerating}
            urlImg={imageUrl || '/static/img/arthur-background.jpg'}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            onChange={onChange}
            disablePicture={disablePicture}
          />
          {cv.urlImg && (
            <div className="uk-card uk-card-default">
              <div className="uk-card-body">
                <h3 className="uk-card-title">
                  Photo de <span className="uk-text-primary">partage</span>
                </h3>
              </div>
              <div className="uk-card-media-bottom">
                <div className="uk-inline uk-width-expand uk-height-medium uk-width-expand uk-cover-container">
                  {previewUrl ? (
                    <Img cover src={previewUrl} alt="Preview" />
                  ) : (
                    <div className="uk-height-medium uk-width-expand" />
                  )}

                  {(cv.status === CV_STATUS.Draft.value ||
                    previewGenerating) && (
                    <>
                      <div
                        className="uk-position-cover"
                        style={{
                          background: 'rgba(0, 0, 0, 0.8)',
                        }}
                      />
                      <div className="uk-overlay uk-position-center uk-light">
                        {previewGenerating ? (
                          <div>
                            Génération de la prévisualisation en cours&nbsp;
                            <div
                              className="uk-margin-small-left"
                              data-uk-spinner="ratio: 0.6"
                            />
                          </div>
                        ) : (
                          <p>Veuillez sauvegarder ou publier le CV</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </Grid>

        <Grid childWidths={['1-2@s']} row match>
          <CVEditCareerPath
            ambitions={cv.ambitions}
            businessLines={cv.businessLines}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            onChange={onChange}
          />
          <CVEditCatchphrase catchphrase={cv.catchphrase} onChange={onChange} />
        </Grid>
      </Grid>
      <StoryProfileCard
        description={cv.story}
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        onChange={onChange}
      />
      <Grid childWidths={['1-2@s']} row>
        <Grid childWidths={['1-1']}>
          <SkillsCard
            list={cv.skills}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            onChange={onChange}
          />
          <InfoProfileCard
            contracts={cv.contracts}
            locations={cv.locations}
            availability={cv.availability}
            languages={cv.languages}
            transport={cv.transport}
            email={email}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            phone={phone}
            address={address}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            onChange={onChange}
            userZone={userZone}
          />
          <PassionsCard
            list={cv.passions}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            onChange={onChange}
          />
          <CVEditReviews
            reviews={cv.reviews}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            onChange={onChange}
          />
        </Grid>
        <Grid childWidths={['1-1']}>
          <ExperiencesProfileCard
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            experiences={cv.experiences}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            onChange={onChange}
          />
          <FormationsProfileCard
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            formations={cv.formations}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            onChange={onChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
