import {
  PublicProfile,
  RecruitementAlert,
  RecruitementAlertDto,
} from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const fetchRecruitementAlertsAdapter = createRequestAdapter(
  'fetchRecruitementAlerts'
).withPayloads<void, RecruitementAlert[]>();

export const createRecruitementAlertAdapter = createRequestAdapter(
  'createRecruitementAlert'
).withPayloads<RecruitementAlertDto, RecruitementAlertDto>();

export const deleteRecruitementAlertAdapter = createRequestAdapter(
  'deleteRecruitementAlert'
).withPayloads<string, string>();

export const updateRecruitementAlertAdapter = createRequestAdapter(
  'updateRecruitementAlert'
).withPayloads<{ id: string; data: RecruitementAlertDto }, RecruitementAlert>();

export const fetchRecruitementAlertMatchingAdapter = createRequestAdapter(
  'fetchRecruitementAlertMatching'
).withPayloads<string, PublicProfile[]>();
