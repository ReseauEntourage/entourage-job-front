import React, { useState } from 'react';
import { Button } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import { HelpGroupContent } from '../HelpGroupContent';
import {
  StyledHelpGroupCharter,
  StyledHelpGroupCharterText,
} from './HelpGroupPage.styles';

interface HelpGroupCharterProps {
  charter: string;
}

/**
 * The beginning of the charter, readable in full by anyone, member or not.
 */
export function HelpGroupCharter({ charter }: HelpGroupCharterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <StyledHelpGroupCharter aria-label="Cadre de prise de parole">
      <H5 title="Cadre de prise de parole" noMarginBottom />
      <StyledHelpGroupCharterText
        $isExpanded={isExpanded}
        data-testid="help-group-charter"
      >
        <HelpGroupContent content={charter} />
      </StyledHelpGroupCharterText>
      <Button
        variant="text"
        size="small"
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        {isExpanded ? 'Réduire' : 'Lire le cadre en entier'}
      </Button>
    </StyledHelpGroupCharter>
  );
}
