import { UserRoles } from '@/src/constants/users';

export type ElearningUnitRole = {
  role: UserRoles;
};

export type ElearningAnswer = {
  id: string;
  questionId: string;
  label: string;
  isCorrect: boolean;
};

export type ElearningQuestion = {
  id: string;
  unitId: string;
  label: string;
  answers: ElearningAnswer[];
};

export type ElearningUnit = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  durationMinutes: number;
  videoUrl: string;
  questions: ElearningQuestion[];
  roles: ElearningUnitRole[];
  userCompletions: ElearningCompletion[];
};

export type ElearningCompletion = {
  id: string;
  userId: string;
  unitId: string;
  validatedAt: string;
};
