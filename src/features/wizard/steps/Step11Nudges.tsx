import React, { useEffect, useState } from 'react';
import { Button } from 'src/components/ui';
import { Content } from 'src/features/backoffice/onboarding/steps/step-nudges/Content/Content';
import { UserRoles } from 'src/constants/users';

interface Step11NudgesProps {
  role: UserRoles;
  initialNudgeIds?: string[];
  onNext: (nudgeIds: string[]) => void;
}

export const Step11Nudges = ({
  role,
  initialNudgeIds = [],
  onNext,
}: Step11NudgesProps) => {
  const [nudgeIds, setNudgeIds] = useState<string[]>(initialNudgeIds);

  useEffect(() => {
    if (initialNudgeIds.length > 0) {
      setNudgeIds(initialNudgeIds);
    }
  }, []);

  const title =
    role === UserRoles.CANDIDATE
      ? 'Partagez vos besoins d'aide'
      : 'Précisez les coups de pouce que vous souhaitez apporter';

  const description =
    role === UserRoles.CANDIDATE
      ? 'Indiquez vos besoins auprès des coachs de la communauté'
      : 'Indiquez les types d'aide que vous souhaitez proposer aux candidats';

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <Content
        userRole={role}
        nudgeIds={nudgeIds}
        onChange={setNudgeIds}
      />
      <br />
      <Button
        onClick={() => onNext(nudgeIds)}
        disabled={nudgeIds.length === 0}
      >
        Continuer
      </Button>
    </div>
  );
};
