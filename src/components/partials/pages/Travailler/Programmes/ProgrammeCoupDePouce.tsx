import React, { Ref } from 'react';
import { IlluCalendrier, OrienterSablier } from 'assets/icons/icons';
import CarteSolidaireIcon from 'assets/icons/orienter-carte-solidaire.svg';
import { SimpleImageText } from 'src/components/partials/utils/SimpleImageText';
import { Button } from 'src/components/utils';
// import { GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
// import { gaEvent } from 'src/lib/gtag';
import { StyledProgrammesList } from './Programmes.styles';
import { COLORS } from 'src/constants/styles';
import { RowIconTitleText } from 'src/components/partials/utils/RowIconTitleText';

const content = [
    {
        title: "Un CV humain et convaincant",
        paragraph: "Un CV qui casse les codes et valorise le parcours du candidat quel qu'il soit et incite à la rencontre",
        src: '/static/img/orienter-cv.png',
    },
    {
        title: "Une diffusion élargie du CV",
        paragraph: "Grâce aux partages du grand public sur les réseaux sociaux via la plateforme",
        src: '/static/img/orienter-diffuser.png',
    },
    {
        title: "Des opportunités d’emplois supplémentaires",
        paragraph: "Des offres d'emplois des entreprises partenaires et des coups de pouce de citoyens engagés",
        src: '/static/img/orienter-emploi.png',
    },
    {
        title: "Des temps forts collectifs",
        paragraph: "Des expériences humaines formatrices, fédératrices et positives",
        src: '/static/img/orienter-calendrier.png',
    },
]


export const ProgrammeCoupDePouce = ({ innerRef }: { innerRef?: Ref<HTMLDivElement> }) => {
    const isDesktop = useIsDesktop();
    const iconsProps = {
        color: COLORS.primaryOrange,
        width: 35,
        height: 35,
    }
    return (
        <>
            <SimpleImageText
                backgroundColor="blue"
                innerRef={innerRef}
                title="Programme Coup de pouce"
                img="/static/img/orientation_who.jpg"
            >
                <StyledProgrammesList
                className={isDesktop ? '' : 'mobile'}
                data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;"
                >
                    <li>
                        <IlluCalendrier {...iconsProps} />{' '}
                        <div>Ponctuel</div>
                    </li>
                    <li>
                        <OrienterSablier {...iconsProps} />{' '}
                        <div>Selon vos besoins</div>
                    </li>
                    <li>
                        <CarteSolidaireIcon {...iconsProps} />{' '}
                        <div>
                            En physique ou en visio
                        </div>
                    </li>
                </StyledProgrammesList>
                <div data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > p; delay: 200;">
                    <p>
                        Le programme Coup de pouce vous permet de solliciter et de bénéficier de coups de pouce ponctuels pour vous aider dans votre recherche d'emploi.
                    </p>
                    <p>
                        Une véritable communauté d’experts bénévoles est à votre disposition pour vous proposer : 
                    </p>
                    <StyledProgrammesList
                        data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;"
                    >
                        <li>
                            - Des ateliers thématiques, autour de du CV ou des entretiens par exemple
                        </li>
                        <li>
                            - De partager leur réseau et de viraliser votre CV 
                        </li>
                        <li>
                            - Des conseils et une méhtodologie pour des recherches d’emploi efficaces
                        </li>
                        <li>
                            - Et tous autres partages d'expérience utiles !
                        </li>
                    </StyledProgrammesList>
                </div>
                <Button
                style="custom-secondary-inverted"
                //   onClick={() => {
                //     openModal(<CandidateContactModal />);
                //     gaEvent(GA_TAGS.PAGE_ORIENTER_CLASSIQUE_ENVOYER_CLIC);
                //   }}
                dataTestId="button-inscrire-coup-de-pouce"
                href="/inscription"
                >
                S'inscrire au programme
                </Button>
            </SimpleImageText>
            <RowIconTitleText
                content={content}
                backgroundColor="blue"
            />
        </>
    );
}
