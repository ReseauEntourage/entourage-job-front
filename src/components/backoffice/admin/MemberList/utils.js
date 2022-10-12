import { CV_STATUS } from 'src/constants';

export const translateStatusCV = (status) => {
  const cvStatus = CV_STATUS[status] ? CV_STATUS[status] : CV_STATUS.Unknown;
  return cvStatus.label;
};
