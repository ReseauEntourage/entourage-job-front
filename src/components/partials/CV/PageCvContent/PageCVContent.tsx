import React from 'react';
import { StyledCVPageContent, StyledCVPageContentFooter, StyledCVExperienceLi, StyledCVPageContentSlide, StyledShareContainer, StyledSkillTag, StyledCVPageContentHeader, StyledCVProfilePicture, StyledCVPageContentDetailsContainer,StyledCVPageContentInformations, StyledCVPageContentExperience, StyledCVPageContentPassions, StyledCVPageContentCarousel} from './PageCVContent.styles';
import Link from 'next/link';
import { H1, H2, H6 } from 'src/components/utils/Headings';
import { Button, Icon } from 'src/components/utils';
import { addPrefix, findConstantFromValue, sortByOrder } from 'src/utils';
import { CVCareerPathSentenceNew as CVCareerPathSentence } from 'src/components/cv';
import { CONTRACTS } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { CarouselSwiper } from 'src/components/utils/CarouselSwiper';

export const PageCVContent = ({cv}) => {
    console.log(cv);

    const locations =
    cv.locations && cv.locations.length > 0 ? sortByOrder(cv.locations) : [];

  return (
    <StyledCVPageContent>
        <Link href={'/candidats?employed=false'}>&#12296; Retour à la page candidats</Link>
        <StyledCVPageContentHeader>
            <div>
                <StyledCVProfilePicture imgSrc={process.env.AWSS3_CDN_URL + addPrefix(cv.urlImg)}>
                        <div className="picture"></div> 
                        <div className="pseudo"></div>
                </StyledCVProfilePicture>
                <StyledShareContainer>
                    <p className="strong">Partagez son CV</p>
                    <p>En le rendant visible vous pouvez créer les rencontres qui peuvent tout changer</p>
                </StyledShareContainer>
            </div>
            <div id="header-details">
                <H1 title={`${cv.user.candidat.firstName} ${cv.user.candidat.lastName}`} color="black"/>
                <CVCareerPathSentence
                  ambitions={cv.ambitions}
                  businessLines={cv.businessLines}
                />
                {cv.catchphrase && <p id='quote'>
                    <Icon
                        name="quote-right"
                    />
                    <span>
                        {cv.catchphrase}
                    </span>
                    <Icon
                        name="quote-right"
                    />
                  </p>}
                <p>{cv.story}</p>
                <div>
                    {cv.skills.length > 0 && cv.skills.map(({name, id}) => {
                        return <StyledSkillTag key={id}>{name}</StyledSkillTag>
                    })}
                </div>
                <H6 title={`Donnez un coup de pouce à ${cv.user.candidat.firstName}.`}/>
                <p>Apporter des conseils, informations sur le secteur d&#8217;activité, retour d&#8217;expérience, mise en contact, une opportunité&nbsp;...</p>
                <Button style="custom-secondary-inverted">M'envoyer un message</Button>
            </div>
        </StyledCVPageContentHeader>
        <StyledCVPageContentDetailsContainer>
            <div>
                <StyledCVPageContentInformations>
                    <H6 title="Informations"/>
                    <ul>
                        {cv.contracts && cv.contracts.length > 0 && <li>
                            <div>
                                <p className="subtitle">
                                    <Icon
                                        name="file-text"
                                        />
                                    {' '}
                                    <span>Type de contrat</span>
                                </p>
                                <p className="content">
                                {cv.contracts
                                    .map(({ name }) => {
                                    return findConstantFromValue(name, CONTRACTS)
                                        .label;
                                    })
                                    .join(' / ')}
                                </p>
                            </div>
                        </li>}
                        {locations && locations.length > 0  && <li>
                            <div>
                                <p className="subtitle">
                                    <Icon
                                        name="location"
                                        />
                                    {' '}
                                    <span>Localisation</span> 
                                </p>
                                <p className="content">
                                {locations
                                    .map(({ name }) => {
                                    return findConstantFromValue(
                                        name,
                                        DEPARTMENTS_FILTERS
                                    ).label;
                                    })
                                    .join(' / ')}
                                </p>
                            </div>
                        </li>}
                        {cv.availability && cv.availability.length > 0 && <li>
                            <div>
                                <p className="subtitle">
                                    <Icon
                                        name="calendar"
                                        />
                                    {' '}
                                    <span>Disponibilité</span>
                                </p>
                                <p className="content">{cv.availability}</p>
                            </div>
                        </li>}
                        {cv.languages && cv.languages.length > 0 && <li>
                            <div>
                                <p className="subtitle">
                                    <Icon
                                        name="commenting"
                                        />
                                    {' '}
                                    <span>Langues</span>
                                </p>
                                <p className="content">
                                {cv.languages
                                    .map(({ name }) => {
                                    return name;
                                    })
                                    .join(' / ')}
                                </p>
                            </div>
                        </li>}
                        {cv.transport && cv.transport.length > 0 && <li>
                            <div>
                                <p className="subtitle">
                                    <Icon
                                        name="car"
                                        />
                                    {' '}
                                    <span>Mobilité</span>
                                </p>
                                <p className="content">{cv.transport}</p>
                            </div>
                        </li>}
                    </ul>
                </StyledCVPageContentInformations>
                {cv.passions.length > 0 && <StyledCVPageContentPassions>
                    <H6 title="Mes Passions"/>
                    <ul>
                        {cv?.passions?.map(({name}) => {
                            return <p>{name}</p>
                        })}
                    </ul>
                </StyledCVPageContentPassions>}
            </div>
            <div>
                {cv.experiences.length > 0 && <StyledCVPageContentExperience>
                    <H2 title="Expériences" color="black"/>
                    <ul>
                        {cv.experiences.map((experience) => {
                            return (
                                <StyledCVExperienceLi>
                                    <div>
                                        {experience.description}
                                    </div>
                                    <div>
                                    {experience.skills.map(({name, id}) => {
                                        return <StyledSkillTag key={id}>{name}</StyledSkillTag>
                                    })}
                                    </div>
                                </StyledCVExperienceLi>
                            )
                        })}
                    </ul>
                </StyledCVPageContentExperience>}
                {/* <StyledCVPageContentExperience>
                    <H2 title="Formation" color="black"/>
                </StyledCVPageContentExperience> */}
            </div>
            
        </StyledCVPageContentDetailsContainer>
        {cv.reviews.length > 0 && (<StyledCVPageContentCarousel>
            <H2 title="Ils me recommandent" color="black" center/>
            <CarouselSwiper
                slides={cv.reviews.map(({text, id, name, status}) => {
                    return (
                        <StyledCVPageContentSlide key={id}>
                            <Icon
                                name="quote-right"
                            />
                                <div>

                                    <span>{text}</span>
                                    {' '}
                                    <span className="strong">{name},{' '}{status}</span>
                                </div>
                            <Icon
                                name="quote-right"
                            />
                        </StyledCVPageContentSlide>
                    )
                })}
            />
        </StyledCVPageContentCarousel>)}
        {/* CTA */}
        <StyledCVPageContentFooter>
            <p>Je suis accompagné(e) dans ma recherche d'emploi et mon intégration en entreprise par le projet LinkedOut. Pour plus d'information, contactez :</p>
            <Link href={'mailto:contact-linkedout@entourage.social'}>contact-linkedout@entourage.social</Link>
        </StyledCVPageContentFooter>
    </StyledCVPageContent>
  )
}
