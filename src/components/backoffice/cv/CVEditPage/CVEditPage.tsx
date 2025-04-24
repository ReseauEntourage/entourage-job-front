import Router from 'next/router';
import Pusher from 'pusher-js';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from 'src/api';
import { CV } from 'src/api/types';
import { openModal } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { Button, ButtonIcon } from 'src/components/utils';
import { ButtonPost } from 'src/components/utils/Button/ButtonPost';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { CV_STATUS, SOCKETS } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { ALL_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop, usePrevious } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import { notificationsActions } from 'src/use-cases/notifications';
import { isRoleIncluded } from 'src/utils/Finding';
import { ButtonDownload } from './ButtonDownload';
import {
  StyledCVEditButtonsContainer,
  StyledCVEditStatusVersion,
  StyledCVNav,
} from './CVEditPage.styles';
import { CVFicheEdition } from './CVFicheEdition';
import { CVModalPreview } from './CVModalPreview';
import { NoCV } from './NoCV';

const pusher = new Pusher(
  // @ts-expect-error after enable TS strict mode. Please, try to fix it
  process.env.NEXT_PUBLIC_PUSHER_API_KEY,
  {
    cluster: 'eu',
    forceTLS: true,
  }
);

interface CVEditPageProps {
  candidateId: string;
  cv: CV;
  setCV: (updatedCV: CV) => void;
}

export const CVEditPage = ({ candidateId, cv, setCV }: CVEditPageProps) => {
  const [cvVersion, setCvVersion] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();
  // const [previewGenerating, setPreviewGenerating] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const [userData, setUserData] = useState({
    email: cv?.user?.candidat?.email,
    phone: cv?.user?.candidat?.phone,
    address: cv?.user?.candidat?.address,
  });

  const dispatch = useDispatch();
  const isDesktop = useIsDesktop();

  const user = useAuthenticatedUser();

  const prevCV = usePrevious(cv);

  const setCVHasBeenRead = useCallback(async () => {
    if (user.role !== USER_ROLES.ADMIN && candidateId) {
      try {
        await Api.putCVRead(candidateId);
      } catch (err) {
        console.error(err);
      }
    }
  }, [candidateId, user.role]);

  useEffect(() => {
    return () => {
      // pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PREVIEW);
      pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PDF);
    };
  }, []);

  useEffect(() => {
    if (cv && cv !== prevCV) {
      if (!cvVersion) setCvVersion(cv.version);
      setImageUrl(`${process.env.NEXT_PUBLIC_AWSS3_URL}/${cv.urlImg}`);
      setCVHasBeenRead();
    }
  }, [candidateId, cv, cvVersion, prevCV, setCVHasBeenRead]);

  useEffect(() => {
    const unsavedChanges = cv && cv.status === CV_STATUS.Draft.value;
    const message =
      "Voulez-vous quitter l'édition du CV? \nLes modifications que vous avez apportées ne seront peut-être pas enregistrées.";
    const routeChangeStart = (url) => {
      // eslint-disable-next-line no-alert
      if (Router.asPath !== url && unsavedChanges && !window.confirm(message)) {
        Router.events.emit('routeChangeError');
        Router.replace(Router, Router.asPath);

        // Keep this string error to stop Next.js from navigating
        // eslint-disable-next-line no-throw-literal
        throw 'Abort route change. Please ignore this error.';
      }
    };

    const beforeunload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', beforeunload);
    Router.events.on('routeChangeStart', routeChangeStart);

    return () => {
      window.removeEventListener('beforeunload', beforeunload);
      Router.events.off('routeChangeStart', routeChangeStart);
    };
  }, [cv]);

  useEffect(() => {
    if (cv) {
      // Use hash to reload image if an update is done
      const previewHash = Date.now();
      setImageUrl(
        `${process.env.NEXT_PUBLIC_AWSS3_URL}${
          process.env.NEXT_PUBLIC_AWSS3_IMAGE_DIRECTORY
        }${cv.UserId}.${
          cv.status === CV_STATUS.Draft.value
            ? CV_STATUS.Progress.value
            : cv.status
        }.jpg?${previewHash}`
      );
    }
  }, [cv]);

  const checkIfLastVersion = useCallback(
    async (callback, isAutoSave = false) => {
      const {
        data: { lastCvVersion },
      } = await Api.getCVLastVersion(candidateId);

      if (cvVersion && lastCvVersion > cvVersion) {
        if (!isAutoSave) {
          openModal(
            <ModalConfirm
              text={
                <>
                  Une version plus récente du CV a déjà été enregistré.
                  <br />
                  <br />
                  Si vous sauvegardez vos modifications, vous écraserez cette
                  version plus récente.
                  <br />
                  <br />
                  Voulez-vous continuer&nbsp;? Si non, faites une copie de vos
                  modifications et rafraîchissez la page.
                </>
              }
              onConfirm={async () => {
                await callback();
              }}
              title="Nouvelle version du CV disponible"
              buttonText="Sauvegarder quand même"
            />
          );
        }
      } else {
        await callback();
      }
    },
    [candidateId, cvVersion]
  );

  const saveUserData = useCallback(
    async ({
      email,
      phone,
      address,
    }: {
      email: string;
      phone: string;
      address: string;
    }) => {
      if (
        (email || phone || address) &&
        (email !== cv.user.candidat.email ||
          phone !== cv.user.candidat.phone ||
          address !== cv.user.candidat.address)
      ) {
        const updatedUserData = {
          email,
          address,
          phone,
        };
        try {
          await Api.putUser(candidateId, updatedUserData);
        } catch (err) {
          console.error(err);
        }
      }
    },
    [candidateId, cv]
  );

  const postCV = useCallback(
    async (status) => {
      await checkIfLastVersion(async () => {
        await saveUserData(userData);

        // const channelPreview = pusher.subscribe(
        //   SOCKETS.CHANNEL_NAMES.CV_PREVIEW
        // );
        const channelPDF = pusher.subscribe(SOCKETS.CHANNEL_NAMES.CV_PDF);

        // setPreviewGenerating(true);
        setPdfGenerating(true);

        // channelPreview.bind(SOCKETS.EVENTS.CV_PREVIEW_DONE, (data) => {
        //   if (data.candidateId === candidateId) {
        //     setPreviewGenerating(false);
        //     pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PREVIEW);
        //   }
        // });

        channelPDF.bind(SOCKETS.EVENTS.CV_PDF_DONE, (data) => {
          if (data.candidateId === candidateId) {
            setPdfGenerating(false);
            pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PDF);
          }
        });

        // prepare data
        const formData = new FormData();
        const obj = {
          ...cv,
          status,
          profileImage: undefined,
        };
        delete obj.id;

        formData.append('cv', JSON.stringify(obj));
        formData.append('profileImage', cv.profileImage);
        // post
        try {
          const { data: updatedCV } = await Api.postCV(
            cv.UserId,
            formData,
            true
          );
          setCV(updatedCV);
          setCvVersion(updatedCV.version);

          dispatch(
            notificationsActions.addNotification({
              type: 'success',
              message:
                user.role === USER_ROLES.CANDIDATE
                  ? 'Votre CV a bien été sauvegardé'
                  : 'Le profil a été mis à jour',
            })
          );
        } catch (err) {
          console.error(err);
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message: "Une erreur s'est produite",
            })
          );
        }
      });
    },
    [
      candidateId,
      checkIfLastVersion,
      dispatch,
      cv,
      saveUserData,
      setCV,
      user,
      userData,
    ]
  );

  const autoSaveCV = useCallback(
    async (
      updatedCV: CV,
      updatedUserData: {
        email: string;
        phone: string;
        address: string;
      }
    ) => {
      await checkIfLastVersion(async () => {
        await saveUserData({
          email: updatedUserData.email,
          phone: updatedUserData.phone,
          address: updatedUserData.address,
        });

        const formData = new FormData();
        const obj = {
          ...updatedCV,
          status: CV_STATUS.Progress.value,
          profileImage: undefined,
        };
        delete obj.id;
        formData.append('cv', JSON.stringify(obj));
        formData.append('autoSave', 'true');

        // post
        try {
          const { data } = await Api.postCV(updatedCV.UserId, formData, true);

          setCvVersion(data.version);
        } catch (err) {
          console.error(err);
        }
      }, true);
    },
    [checkIfLastVersion, saveUserData]
  );

  // aucun CV
  if (!cv) {
    return (
      <NoCV
        candidateId={candidateId}
        user={user}
        setCV={(cvData) => {
          setCV(cvData);
          setCvVersion(cvData.version);
        }}
      />
    );
  }

  const cvStatus = CV_STATUS[cv.status]
    ? CV_STATUS[cv.status]
    : CV_STATUS.Unknown;

  // affichage du CV
  return (
    <div>
      <StyledCVNav className={isDesktop ? '' : 'mobile'}>
        <StyledCVEditStatusVersion>
          <div>
            Statut&nbsp;:{' '}
            <span className={`uk-text-${cvStatus.style}`}>
              {cvStatus.label}
            </span>
          </div>
          {user.role === USER_ROLES.ADMIN && (
            <div>
              Version&nbsp;:&nbsp;
              {cvVersion}
            </div>
          )}
        </StyledCVEditStatusVersion>
        <StyledCVEditButtonsContainer className={isDesktop ? '' : 'mobile'}>
          <ButtonDownload
            pdfGenerating={pdfGenerating}
            candidateId={cv.UserId}
            firstName={cv.user?.candidat.firstName}
            lastName={cv.user?.candidat.lastName}
          />
          <Button
            onClick={() => {
              openModal(
                <CVModalPreview
                  cv={cv}
                  // @ts-expect-error after enable TS strict mode. Please, try to fix it
                  imageUrl={imageUrl}
                />
              );
            }}
            variant="secondary"
            rounded
          >
            Prévisualiser
          </Button>
          <ButtonPost
            variant="primary"
            action={async () => {
              await postCV(CV_STATUS.Progress.value);
            }}
            text="Sauvegarder"
          />
          {isRoleIncluded(ALL_USER_ROLES, user.role) && (
            <ButtonPost
              variant="primary"
              action={async () => {
                await postCV(CV_STATUS.Pending.value);
              }}
              text="Soumettre"
            />
          )}
          {user.role === USER_ROLES.ADMIN && (
            <ButtonPost
              variant="primary"
              action={async () => {
                await postCV(CV_STATUS.Published.value);
              }}
              text="Publier"
            />
          )}
          {user.role !== USER_ROLES.ADMIN && (
            <ButtonIcon
              icon={<LucidIcon name="CircleHelp" />}
              href={process.env.NEXT_PUBLIC_TUTORIAL_CV}
              newTab
              onClick={() => {
                gaEvent(GA_TAGS.BACKOFFICE_CV_AIDE);
              }}
            />
          )}
        </StyledCVEditButtonsContainer>
      </StyledCVNav>
      <CVFicheEdition
        email={userData.email}
        phone={userData.phone}
        address={userData.address}
        cv={cv}
        previewGenerating={false}
        onChange={async (updatedCV, updatedUserData = {}) => {
          await autoSaveCV(
            { ...cv, ...updatedCV },
            { ...userData, ...updatedUserData }
          );

          setUserData({
            ...userData,
            ...updatedUserData,
          });

          setCV({
            ...cv,
            ...updatedCV,
            status: CV_STATUS.Draft.value,
          });
        }}
        userZone={cv.user?.candidat.zone}
      />
    </div>
  );
};
