import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CONTRACTS, WORKING_EXPERIENCE_FILTERS } from '@/src/constants';
import { RecruitementAlert, RecruitementAlertDto } from 'src/api/types';
import {
  fetchRecruitementAlertMatchingAction,
  selectRecruitementAlertMatchingById,
  selectFetchRecruitementAlertMatchingLoading,
  deleteRecruitementAlertAction,
  updateRecruitementAlertAction,
} from 'src/use-cases/recruitement-alerts';

export const useCompanyRecruitementAlertContent = (
  alert: RecruitementAlert
) => {
  const dispatch = useDispatch();
  const matching = useSelector(selectRecruitementAlertMatchingById(alert.id));
  const isLoadingMatching = useSelector(
    selectFetchRecruitementAlertMatchingLoading
  );

  const {
    id,
    name,
    jobName,
    department,
    businessSectors,
    workingExperienceYears,
    contractType,
    skills,
  } = alert;

  useEffect(() => {
    if (id) {
      dispatch(fetchRecruitementAlertMatchingAction(id));
    }
  }, [dispatch, id]);

  const contractString = useMemo(
    () =>
      (CONTRACTS.find((contract) => contract.value === contractType)
        ?.label as string) || '',
    [contractType]
  );

  const title = useMemo(
    () => (contractString ? `${name} - ${contractString}` : name),
    [contractString, name]
  );

  // Preparation of badges to display in the requested order
  const badgesStringList = useMemo(() => {
    const badges: string[] = [];

    // 1. Department
    if (department) {
      badges.push(department);
    }

    // 2. Job position
    if (jobName) {
      badges.push(jobName);
    }

    // 3. Working experience years
    if (workingExperienceYears) {
      const workingExperienceLabel = WORKING_EXPERIENCE_FILTERS.find(
        (exp) => exp.value === workingExperienceYears
      )?.label;
      if (workingExperienceLabel) {
        badges.push(workingExperienceLabel as string);
      }
    }

    // 4. Contract type (already used in the title, but also added to badges)
    if (contractString) {
      badges.push(contractString);
    }

    // 5. Business sectors
    if (businessSectors && businessSectors.length > 0) {
      businessSectors.forEach((sector) => {
        badges.push(sector.name);
      });
    }

    // 6. Skills
    if (skills && skills.length > 0) {
      skills.forEach((skill) => {
        badges.push(skill.name);
      });
    }

    return badges;
  }, [
    department,
    jobName,
    workingExperienceYears,
    contractString,
    businessSectors,
    skills,
  ]);

  // Memoization of candidates from matching data
  const candidates = useMemo(() => matching || [], [matching]);

  const handleDelete = useCallback(() => {
    dispatch(deleteRecruitementAlertAction(id));
  }, [dispatch, id]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleUpdateAlert = useCallback(
    (updatedData: RecruitementAlertDto) => {
      dispatch(updateRecruitementAlertAction({ id, data: updatedData }));
      // Don't close the modal here, it will be closed by the modal component itself
    },
    [dispatch, id]
  );

  const alertData = useMemo(() => alert, [alert]);

  return {
    title,
    badgesStringList,
    isLoadingMatching,
    candidates,
    handleDelete,
    handleEdit,
    isEditModalOpen,
    handleCloseEditModal,
    handleUpdateAlert,
    alertData,
  };
};
