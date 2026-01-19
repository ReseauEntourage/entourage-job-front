import React from 'react';
import { User } from '@/src/api/types';

export enum Context {
  CANDIDATE = 'CANDIDATE',
  COACH = 'COACH',
  COMPANY_ADMIN_TBS_MODE = 'COMPANY_ADMIN_TBS_MODE',
  COMPANY_ADMIN_RECRUITMENT_MODE = 'COMPANY_ADMIN_RECRUITMENT_MODE',
}

export interface StepContent {
  title: string;
  content: string;
  icon: React.ReactElement;
  cta: {
    label: string;
    href?: string;
    onClick?: (currentUser?: User) => void;
  };
}
