import React, { useCallback, useEffect, useState } from 'react';
import { CV } from 'src/api/types';
import { Grid } from 'src/components/utils';

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
  onChange: (
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
  const [imageUrl, setImageUrl] = useState<string>();

  const prevPreviewGenerating = usePrevious(previewGenerating);

  const updateImage = useCallback(() => {
    // Use hash to reload image if an update is done
    const previewHash = Date.now();
    const baseUrl = `${process.env.NEXT_PUBLIC_AWSS3_URL}${process.env.AWSS3_IMAGE_DIRECTORY}${cv.UserId}.${cv.status}`;
    setImageUrl(`${baseUrl}.jpg?${previewHash}`);
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
            onChange={onChange}
            disablePicture={disablePicture}
          />
        </Grid>

        <Grid childWidths={['1-2@s']} row match>
          <CVEditCareerPath
            ambitions={cv.ambitions}
            businessLines={cv.businessLines}
            onChange={onChange}
          />
          <CVEditCatchphrase catchphrase={cv.catchphrase} onChange={onChange} />
        </Grid>
      </Grid>
      <StoryProfileCard description={cv.story} onChange={onChange} />
      <Grid childWidths={['1-2@s']} row>
        <Grid childWidths={['1-1']}>
          <SkillsCard list={cv.skills} onChange={onChange} />
          <InfoProfileCard
            contracts={cv.contracts}
            locations={cv.locations}
            availability={cv.availability}
            languages={cv.languages}
            transport={cv.transport}
            email={email}
            phone={phone}
            address={address}
            onChange={onChange}
            userZone={userZone}
          />
          <PassionsCard list={cv.passions} onChange={onChange} />
          <CVEditReviews reviews={cv.reviews} onChange={onChange} />
        </Grid>
        <Grid childWidths={['1-1']}>
          <ExperiencesProfileCard
            experiences={cv.experiences}
            onChange={onChange}
          />
          <FormationsProfileCard
            formations={cv.formations}
            onChange={onChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
