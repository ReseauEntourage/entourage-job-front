import React from 'react';
import { Button, Text } from '@/src/components/ui';
import { ButtonVariant } from '@/src/components/ui/Button/Button.types';
import { H1 } from '@/src/components/ui/Headings';
import { LegacyImg } from '@/src/components/ui/Images/LegacyImg';
import { useIsDesktop } from '@/src/hooks/utils';
import {
  StyledPageHero,
  StyledPageHeroContainer,
  StyledPageHeroImageCard,
  StyledPageHeroContent,
  StyledPageHeroCTAsContainer,
  StyledPageHeroWave,
} from './PageHero.styles';

export interface PageHeroCTAProps {
  onClick?: () => void;
  label: React.ReactNode;
  href?: string;
  variant?: 'default' | 'primary' | 'secondary';
  isExternal?: boolean;
  newTab?: boolean;
  dataTest?: string;
  color?: string;
}

interface PageHeroProps {
  img: string;
  imgMobile?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  alt?: string;
  cta?: PageHeroCTAProps | PageHeroCTAProps[];
}

// Le CTA principal du hero (sans variant "secondary" explicite) utilise un fond
// dédié (heroPrimary) car COLORS.primaryBlue, utilisé par le variant Button
// "primary", est désormais la couleur de fond du hero lui-même.
const resolveHeroVariant = (
  variant: PageHeroCTAProps['variant']
): ButtonVariant => (variant === 'secondary' ? 'secondary' : 'heroPrimary');

export const PageHero = ({
  title,
  description,
  img,
  imgMobile,
  alt,
  cta,
}: PageHeroProps) => {
  const isDesktop = useIsDesktop();

  return (
    <StyledPageHero>
      <StyledPageHeroContainer>
        <StyledPageHeroImageCard>
          <LegacyImg
            src={isDesktop ? img : imgMobile || img}
            cover
            alt={alt || ''}
          />
        </StyledPageHeroImageCard>
        <StyledPageHeroContent>
          <H1 title={title} color="white" />
          {description && (
            <Text size={isDesktop ? 'xlarge' : 'normal'} color="white">
              {description}
            </Text>
          )}
          {cta && !Array.isArray(cta) && (
            <Button
              variant={resolveHeroVariant(cta.variant)}
              onClick={cta.onClick}
              dataTestId={cta.dataTest}
              href={cta.href}
              isExternal={cta.isExternal}
              newTab={cta.newTab}
              weight="bold"
            >
              {cta.label}
            </Button>
          )}
          {cta && Array.isArray(cta) && cta.length > 0 && (
            <StyledPageHeroCTAsContainer>
              {cta.map(
                (
                  {
                    label,
                    variant,
                    dataTest,
                    onClick,
                    href,
                    isExternal,
                    newTab,
                  },
                  index
                ) => {
                  return (
                    <Button
                      key={index.toString()}
                      variant={resolveHeroVariant(variant)}
                      onClick={onClick}
                      href={href}
                      isExternal={isExternal}
                      dataTestId={dataTest}
                      newTab={newTab}
                      weight="bold"
                    >
                      {label}
                    </Button>
                  );
                }
              )}
            </StyledPageHeroCTAsContainer>
          )}
        </StyledPageHeroContent>
      </StyledPageHeroContainer>
      <StyledPageHeroWave>
        <svg
          width="1447"
          height="115"
          viewBox="0 0 1447 115"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M805.081 4.84743C1035.43 -16.5074 1329 37.8482 1447 67.6953L1447 115L0 115L-4.13552e-06 67.6954C339.308 112.635 517.149 31.5409 805.081 4.84743Z"
            fill="white"
          />
        </svg>
      </StyledPageHeroWave>
    </StyledPageHero>
  );
};
