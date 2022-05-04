import React, { memo, useCallback, useEffect, useState } from 'react';
import Api from 'src/Axios';
import UIkit from 'uikit';
import { Button } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import { usePrevious } from 'src/hooks/utils';
import { openModal } from 'src/components/modals/Modal';
import ModalConfirm from 'src/components/modals/ModalConfirm';

export function useBulkActions(apiRoute, refreshElementsCallback) {
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
      openModal(
        <ModalConfirm
          text={`Êtes-vous sûr(e) de vouloir effectuer cette action sur ${
            selectedIds.length
          } élément${selectedIds.length > 1 ? 's' : ''} ?`}
          buttonText="Valider"
          onConfirm={async () => {
            try {
              const {
                data: { nbUpdated },
              } = await Api[method](`${apiRoute}/bulk`, {
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
    [apiRoute, refreshElementsCallback, selectedIds]
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

  const SelectionModeButton = memo(() => {
    return (
      <Button
        onClick={toggleSelectionMode}
        style="text"
        className="uk-text-meta"
      >
        {selectionModeActivated ? (
          <>
            Quitter le mode sélection&nbsp;
            <IconNoSSR name="close" ratio={0.8} />
          </>
        ) : (
          <>
            Mode sélection&nbsp;
            <IconNoSSR name="pencil" ratio={0.8} />
          </>
        )}
      </Button>
    );
  }, [selectionModeActivated, toggleSelectionMode]);

  return {
    selectElement,
    executeAction,
    isElementSelected,
    selectionModeActivated,
    toggleSelectionMode,
    SelectionModeButton,
    hasSelection: selectedIds.length > 0,
  };
}
