import { UserRoles } from '@/src/constants/users';
import {
  ElearningCompletion,
  ElearningUnit,
} from '@/src/features/backoffice/elearning/elearning.types';
import { createRequestAdapter } from '@/src/store/utils';

export const fetchElearningUnitsAdapter = createRequestAdapter(
  'fetchElearningUnits'
).withPayloads<UserRoles, ElearningUnit[]>();

export const postElearningCompletionAdapter = createRequestAdapter(
  'postElearningCompletion'
).withPayloads<{ unitId: string }, ElearningCompletion>();
