import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from '@/src/api';
import { UpdateCompanyDto } from '@/src/api/types';
import { companyActions } from '@/src/use-cases/company';
import { currentUserActions } from '@/src/use-cases/current-user';

export const useHeaderCompany = (id: string) => {
  const dispatch = useDispatch();

  const updateCompany = useCallback(
    (fields) => {
      const companyFields: UpdateCompanyDto = {
        departmentId: fields.departmentId?.value as string,
        businessSectorIds:
          fields.businessSectorIds?.map(
            (businessSectorId) => businessSectorId.value
          ) ?? undefined,
      };

      // Update the company user profile
      Api.updateCompany(companyFields);

      // Upload company logo
      if (fields.logo && fields.logo[0]) {
        dispatch(
          companyActions.updateCompanyLogoRequested({
            companyId: id,
            logoFile: fields.logo[0],
          })
        );
      }
      dispatch(currentUserActions.fetchUserRequested());
    },
    [dispatch, id]
  );

  return { updateCompany };
};
