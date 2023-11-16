import React, { useCallback, useEffect, useState } from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { openModal } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { usePrevious } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';

export function useBulkActions(apiRoute, refreshElementsCallback, tag) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectionModeActivated, setSelectionModeActivated] = useState(false);

  const prevSelectionModeActivated = usePrevious(selectionModeActivated);

  const selectElement = useCallback(
    ({ id }) => {
      if (selectedIds.includes(id)) {
        setSelectedIds((prevSelectedIds) => {
          return prevSelectedIds.filter((prevSelectedId) => {
            return prevSelectedId !== id;
          });
        });
      } else {
        setSelectedIds((prevSelectedIds) => {
          return [...prevSelectedIds, id];
        });
      }
    },
    [selectedIds]
  );

  const executeAction = useCallback(
    async (attributesToUpdate = {}, method = 'put') => {
      const apiMethods = {
        put: {
          opportunity: (params) => {
            return Api.putBulkOpportunities(params);
          },
          candidate: (params) => {
            return Api.putBulkCandidates(params);
          },
        },
      };
      openModal(
        <ModalConfirm
          text={`Êtes-vous sûr(e) de vouloir effectuer cette action sur ${
            selectedIds.length
          } élément${selectedIds.length > 1 ? 's' : ''} ?`}
          buttonText="Valider"
          onConfirm={async () => {
            if (tag) {
              gaEvent(tag);
            }
            try {
              const {
                data: { nbUpdated },
              } = await apiMethods[method][apiRoute]({
                attributes: attributesToUpdate,
                ids: selectedIds,
              });

              setSelectedIds([]);
              if (refreshElementsCallback) await refreshElementsCallback();

              UIkit.notification(
                `${nbUpdated} élément${
                  nbUpdated > 1 ? 's ont' : ' a'
                } été mis à jour`,
                'success'
              );
            } catch (err) {
              console.error(err);
              UIkit.notification(`Une erreur est survenue.`, 'danger');
            }
          }}
        />
      );
    },
    [apiRoute, refreshElementsCallback, selectedIds, tag]
  );

  const isElementSelected = useCallback(
    ({ id }) => {
      return selectedIds.includes(id);
    },
    [selectedIds]
  );

  const toggleSelectionMode = useCallback(() => {
    setSelectionModeActivated((prevSelectionMode) => {
      return !prevSelectionMode;
    });
  }, []);

  useEffect(() => {
    if (
      selectionModeActivated !== prevSelectionModeActivated &&
      !selectionModeActivated
    ) {
      setSelectedIds([]);
    }
  }, [prevSelectionModeActivated, selectionModeActivated]);

  return {
    selectElement,
    executeAction,
    isElementSelected,
    selectionModeActivated,
    toggleSelectionMode,
    hasSelection: selectedIds.length > 0,
  };
}
