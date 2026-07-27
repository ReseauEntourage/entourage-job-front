import { UserProfileSectorOccupation } from 'src/api/types';

export const getSectorOccupationLabels = (
  sectorOccupations?: UserProfileSectorOccupation[]
): { occupation?: string; sector?: string } => {
  const [firstSectorOccupation] = sectorOccupations ?? [];
  return {
    occupation: firstSectorOccupation?.occupation?.name,
    sector: firstSectorOccupation?.businessSector?.name,
  };
};
