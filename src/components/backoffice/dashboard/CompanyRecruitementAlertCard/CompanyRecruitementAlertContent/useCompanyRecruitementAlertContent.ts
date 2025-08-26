import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CONTRACTS, WORKING_EXPERIENCE_FILTERS } from '@/src/constants';
import { RecruitementAlert, RecruitementAlertDto } from 'src/api/types';
import {
  fetchRecruitementAlertMatchingAction,
  selectRecruitementAlertMatching,
  selectFetchRecruitementAlertMatchingLoading,
  deleteRecruitementAlertAction,
  updateRecruitementAlertAction,
} from 'src/use-cases/recruitement-alerts';

export const useCompanyRecruitementAlertContent = (
  alert: RecruitementAlert
) => {
  const dispatch = useDispatch();
  const matching = useSelector(selectRecruitementAlertMatching);
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

  const contractString =
    (CONTRACTS.find((contract) => contract.value === contractType)
      ?.label as string) || '';
  const title = contractString ? `${name} - ${contractString}` : name;

  // Preparation of badges to display in the requested order
  const badgesStringList: string[] = [];

  // 1. Department
  if (department) {
    badgesStringList.push(department);
  }

  // 2. Job position
  if (jobName) {
    badgesStringList.push(jobName);
  }

  // 3. Working experience years
  if (workingExperienceYears) {
    const workingExperienceLabel = WORKING_EXPERIENCE_FILTERS.find(
      (exp) => exp.value === workingExperienceYears
    )?.label;
    if (workingExperienceLabel) {
      badgesStringList.push(workingExperienceLabel as string);
    }
  }

  // 4. Contract type (already used in the title, but also added to badges)
  if (contractString) {
    badgesStringList.push(contractString);
  }

  // 5. Business sectors
  if (businessSectors && businessSectors.length > 0) {
    businessSectors.forEach((sector) => {
      badgesStringList.push(sector.name);
    });
  }

  // 6. Skills
  if (skills && skills.length > 0) {
    skills.forEach((skill) => {
      badgesStringList.push(skill.name);
    });
  }

  // Calculate the number of matching candidates
  const candidatesCount = matching?.length || 0;

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

  return {
    title,
    badgesStringList,
    isLoadingMatching,
    matching,
    candidatesCount,
    handleDelete,
    handleEdit,
    isEditModalOpen,
    handleCloseEditModal,
    handleUpdateAlert,
    alertData: alert,
  };
};
