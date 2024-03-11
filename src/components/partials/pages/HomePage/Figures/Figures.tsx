import React from 'react'
import { Section, Typography } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { StyledFigure, StyledFigureMobileContainer, StyledFigureNumber, StyledFiguresContainer, StyledFiguresSubtitle, StyledMobileFigure } from './Figures.styles';
import { IlluCoeurMainsOuvertes, IlluConversation, IlluCV, IlluMalette } from 'assets/icons/icons';
import { useIsDesktop } from 'src/hooks/utils';

const staticNumbers = [
    { 
      icon: <IlluCV width={140} height={110} />,
      value: "+ 500", 
      description: 'candidat(e)s accompagnés', 
    },
    {
      icon: <IlluMalette width={140} height={110} />,
      value: "700",
      description: "entreprises mobilisées",
    },
    {
      icon: <IlluConversation width={140} height={110} />,
      value: '71%',
      description: 'de sorties positives en 2023',
    },
    {
      icon: <IlluCoeurMainsOuvertes width={140} height={110} />,
      value: "+ 1000",
      description: "bénévoles engagés",
    }
  ];

export const Figures = () => {
  const isDesktop = useIsDesktop();
  return (
    <Section id="profiles">
        <H2 title="Et le mieux c'est que ça marche" color="black" center />
        <StyledFiguresSubtitle>
          <Typography size="large">
              Nos candidat(e)s et nos coachs peuvent en témoigner. Les chiffres aussi !
          </Typography>
        </StyledFiguresSubtitle>
        {
          isDesktop ? (
            <StyledFiguresContainer>
              {
                  staticNumbers.map(number => {
                      return (
                          <StyledFigure key={number.description}>
                              {number.icon}
                              <StyledFigureNumber>
                                {number.value}
                              </StyledFigureNumber> 
                                <Typography size="large" color="blue">
                                  {number.description}
                                </Typography>
                          </StyledFigure>
                      )
                  })
              }
            </StyledFiguresContainer>
          ) : (
            <StyledFigureMobileContainer>
              {
                staticNumbers.map(number => {
                  return (
                    <StyledMobileFigure key={number.description}>
                      {number.icon}
                      <StyledFigureNumber>
                        {number.value}
                      </StyledFigureNumber> 
                      <Typography size="large" color="blue">
                        {number.description}
                      </Typography>
                    </StyledMobileFigure>
                  )
                })
              }
            </StyledFigureMobileContainer>
          )
        }
    </Section>
  )
}
