import UIkit from 'uikit';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Pusher from 'pusher-js';
import Api from 'src/Axios';
import { Button, Grid } from 'src/components/utils';
import { CVBackground, CVFiche, CVFicheEdition } from 'src/components/cv';
import { UserContext } from 'src/components/store/UserProvider';
import ButtonPost from 'src/components/backoffice/cv/ButtonPost';

import {
  AMBITIONS_PREFIXES,
  CV_STATUS,
  SOCKETS,
  USER_ROLES,
} from 'src/constants';
import NoCV from 'src/components/backoffice/cv/NoCV';
import ButtonDownload from 'src/components/backoffice/cv/ButtonDownload';
import { openModal, useModalContext } from 'src/components/modals/Modal';
import ModalGeneric from 'src/components/modals/ModalGeneric';
import { usePrevious } from 'src/hooks/utils';
import ModalConfirm from 'src/components/modals/ModalConfirm';

const pusher = new Pusher(process.env.PUSHER_API_KEY, {
  cluster: 'eu',
  forceTLS: true,
});

const ModalPreview = ({ imageUrl, cv }) => {
  const { onClose } = useModalContext();

  return (
    <ModalGeneric title="PrĂ©visualisation du CV" fullWidth>
      {cv.urlImg && (
        <CVBackground
          url={cv.profileImageObjectUrl ? cv.profileImageObjectUrl : imageUrl}
        />
      )}
      <CVFiche cv={cv} actionDisabled />
      <div className="uk-modal-footer uk-padding-remove-horizontal uk-padding-remove-bottom uk-margin-medium-top">
        <Button onClick={onClose} style="default">
          Fermer
        </Button>
      </div>
    </ModalGeneric>
  );
};

ModalPreview.propTypes = {
  cv: PropTypes.shape({
    catchphrase: PropTypes.string,
    story: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.string),
    availability: PropTypes.string,
    urlImg: PropTypes.string,
    contracts: PropTypes.arrayOf(PropTypes.string),
    ambitions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        order: PropTypes.number.isRequired,
        prefix: PropTypes.oneOf(
          AMBITIONS_PREFIXES.map(({ value }) => {
            return value;
          })
        ),
      })
    ),
    businessLines: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        order: PropTypes.number.isRequired,
      })
    ).isRequired,
    languages: PropTypes.arrayOf(PropTypes.string),
    transport: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string),
    passions: PropTypes.arrayOf(PropTypes.string),

    reviews: PropTypes.arrayOf(PropTypes.string),
    experiences: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
    UserId: PropTypes.string,
    profileImageObjectUrl: PropTypes.string,
  }).isRequired,
  imageUrl: PropTypes.string.isRequired,
};

const CVPageContent = ({ candidatId, cv, setCV }) => {
  const [cvVersion, setCvVersion] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(undefined);
  const [previewGenerating, setPreviewGenerating] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const { user } = useContext(UserContext);

  const prevCV = usePrevious(cv);

  const setCVHasBeenRead = useCallback(() => {
    if (user && user.role !== USER_ROLES.ADMIN && candidatId) {
      Api.put(`/cv/read/${candidatId}`)
        .then(() => {
          console.log('Note has been read');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [candidatId, user]);

  useEffect(() => {
    return () => {
      pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PREVIEW);
      pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PDF);
    };
  }, []);

  useEffect(() => {
    if (cv && cv !== prevCV) {
      if (!cvVersion) setCvVersion(cv.version);
      setImageUrl(`${process.env.AWSS3_URL}${cv.urlImg}`);
      setCVHasBeenRead();
    }
  }, [candidatId, cv, cvVersion, prevCV, setCVHasBeenRead]);

  useEffect(() => {
    const unsavedChanges = cv && cv.status === CV_STATUS.Draft.value;
    const message =
      "Voulez-vous quitter l'Ă©dition du CV? \nLes modifications que vous avez apportĂ©es ne seront peut-Ăªtre pas enregistrĂ©es.";
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
    if (!previewGenerating && cv) {
      // Use hash to reload image if an update is done
      const previewHash = Date.now();
      setImageUrl(
        `${process.env.AWSS3_URL}${process.env.AWSS3_IMAGE_DIRECTORY}${
          cv.UserId
        }.${
          cv.status === CV_STATUS.Draft.value
            ? CV_STATUS.Progress.value
            : cv.status
        }.jpg?${previewHash}`
      );
    }
  }, [cv, previewGenerating]);

  const saveUserData = (modifiedCv) => {
    return new Promise((res, rej) => {
      if (
        (modifiedCv.email || modifiedCv.phone || modifiedCv.address) &&
        (modifiedCv.email !== cv.user.candidat.email ||
          modifiedCv.phone !== cv.user.candidat.phone ||
          modifiedCv.address !== cv.user.candidat.address)
      ) {
        const userData = {
          email: modifiedCv.email,
          address: modifiedCv.address,
          phone: modifiedCv.phone,
        };

        Api.put(`/user/${candidatId}`, userData)
          .then(({ newUserData }) => {
            res(newUserData);
          })
          .catch((err) => {
            rej(err);
          });
      } else {
        res();
      }
    });
  };

  const checkIfLastVersion = useCallback(
    async (callback, isAutoSave) => {
      const {
        data: { lastCvVersion },
      } = await Api.get(`/cv/lastVersion/${candidatId}`);

      if (lastCvVersion > cvVersion) {
        if (!isAutoSave) {
          openModal(
            <ModalConfirm
              text={
                <>
                  Une version plus rĂ©cente du CV a dĂ©jĂ  Ă©tĂ© enregistrĂ©.
                  <br />
                  <br />
                  Si vous sauvegardez vos modifications, vous Ă©craserez cette
                  version plus rĂ©cente.
                  <br />
                  <br />
                  Voulez-vous continuer&nbsp;? Si non, faites une copie de vos
                  modifications et rafraĂ®chissez la page.
                </>
              }
              onConfirm={async () => {
                await callback();
              }}
              title="Nouvelle version du CV disponible"
              buttonText="Sauvegarder quand mĂªme"
            />
          );
        }
      } else {
        await callback();
      }
    },
    [candidatId, cvVersion]
  );

  const postCV = async (status) => {
    await checkIfLastVersion(() => {
      const channelPreview = pusher.subscribe(SOCKETS.CHANNEL_NAMES.CV_PREVIEW);
      const channelPDF = pusher.subscribe(SOCKETS.CHANNEL_NAMES.CV_PDF);

      setPreviewGenerating(true);
      setPdfGenerating(true);

      channelPreview.bind(SOCKETS.EVENTS.CV_PREVIEW_DONE, (data) => {
        if (data.candidatId === candidatId) {
          setPreviewGenerating(false);
          pusher.unsubscribe(SOCKETS.CHANNEL_NAMES.CV_PREVIEW);
        }
      });

      channelPDF.bind(SOCKETS.EVENTS.CV_PDF_DONE, (data) => {
        if (data.candidatId === candidatId) {
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
      return Api.post(`/cv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(({ data }) => {
          setCV(data);
          setCvVersion(data.version);

          UIkit.notification(
            user.role === USER_ROLES.CANDIDAT
              ? 'Votre CV a bien Ă©tĂ© sauvegardĂ©'
              : 'Le profil a Ă©tĂ© mis Ă  jour',
            'success'
          );
        })
        .catch((err) => {
          console.error(err);
          UIkit.notification("Une erreur s'est produite", 'danger');
        });
    });
  };

  const autoSaveCV = async (tempCV) => {
    await checkIfLastVersion(() => {
      const formData = new FormData();
      const obj = {
        ...tempCV,
        status: CV_STATUS.Progress.value,
        profileImage: undefined,
      };
      delete obj.id;
      formData.append('cv', JSON.stringify(obj));
      formData.append('autoSave', true);
      // post
      return saveUserData(obj)
        .then(() => {
          return Api.post(`/cv`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        })
        .then(({ data }) => {
          console.log('Auto-save succeeded.');
          setCvVersion(data.version);
        })
        .catch(() => {
          console.log('Auto-save failed.');
        });
    }, true);
  };

  if (user === null) return null;

  // aucun CV
  if (cv === null) {
    return (
      <NoCV
        candidatId={candidatId}
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
      <Grid between middle>
        <Grid column gap="collapse">
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
        </Grid>

        <Grid row gap="small">
          <ButtonDownload
            pdfGenerating={pdfGenerating}
            candidatId={cv.UserId}
            firstName={cv.user.candidat.firstName}
            lastName={cv.user.candidat.lastName}
          />
          <Button
            onClick={() => {
              openModal(<ModalPreview imageUrl={imageUrl} cv={cv} />);
            }}
            style="default"
          >
            PrĂ©visualiser
          </Button>
          <ButtonPost
            style="primary"
            action={async () => {
              return postCV(CV_STATUS.Progress.value);
            }}
            text="Sauvegarder"
          />
          {user.role === USER_ROLES.COACH && (
            <ButtonPost
              style="primary"
              action={async () => {
                return postCV(CV_STATUS.Pending.value);
              }}
              text="Soumettre"
            />
          )}
          {user.role === USER_ROLES.ADMIN && (
            <ButtonPost
              style="primary"
              action={async () => {
                return postCV(CV_STATUS.Published.value);
              }}
              text="Publier"
            />
          )}
        </Grid>
      </Grid>
      <CVFicheEdition
        email={cv.email || cv.user.candidat.email}
        phone={cv.phone || cv.user.candidat.phone}
        address={cv.address || cv.user.candidat.address}
        cv={cv}
        previewGenerating={previewGenerating}
        disablePicture={
          user.role === USER_ROLES.CANDIDAT || user.role === USER_ROLES.COACH
        }
        onChange={async (fields) => {
          await autoSaveCV({ ...cv, ...fields });
          setCV({ ...cv, ...fields, status: CV_STATUS.Draft.value });
        }}
        userZone={cv.user.candidat.zone}
      />
    </div>
  );
};

CVPageContent.propTypes = {
  candidatId: PropTypes.string.isRequired,
  cv: PropTypes.shape(),
  setCV: PropTypes.func.isRequired,
};

CVPageContent.defaultProps = {
  cv: undefined,
};

export default CVPageContent;
