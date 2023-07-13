// import PropTypes from 'prop-types';
// import React from 'react';
// import { CVCareerPathSentence } from 'src/components/cv/CVCareerPathSentence';
// import { Grid, Img, SimpleLink, Icon } from 'src/components/utils';
// import { CONTRACTS } from 'src/constants';
// import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
// import { useUpdateSharesCount } from 'src/hooks';
// import {
//   findConstantFromValue,
//   formatParagraph,
//   sortByName,
//   sortByOrder,
// } from 'src/utils';
// import { CVShape } from './CV.shape';
// import { CVCallToActions } from './CVCallToActions';

// /**
//  * Le cv en public et en preview
//  */
// export const CVFiche = ({ cv, actionDisabled }) => {
//   const updateSharesCount = useUpdateSharesCount();

//   const experiences =
//     cv.experiences && cv.experiences.length > 0
//       ? sortByOrder(cv.experiences)
//       : [];

//   const locations =
//     cv.locations && cv.locations.length > 0 ? sortByOrder(cv.locations) : [];

//   const showCareerPathSentence =
//     (cv.ambitions && cv.ambitions.length > 0) ||
//     (cv.businessLines && cv.businessLines.length > 0);

//   return (
//     <div id="cv-fiche" className="uk-container uk-position-relative">
//       <div className="uk-card uk-card-default uk-card-body uk-card-large uk-margin-medium ">
//         <Grid childWidths={['1-1']}>
//           <div className="uk-text-center">
//             <h1 className="uk-text-bold uk-heading-small uk-text-primary">
//               {cv.user.candidat.firstName} {cv.user.candidat.lastName}
//             </h1>
//             {cv.catchphrase && (
//               <div className="uk-flex uk-flex-center uk-margin-medium-top">
//                 <h4
//                   className="uk-position-relative uk-text-italic"
//                   style={{
//                     width: 'fit-content',
//                     marginBottom: '8px',
//                   }}
//                 >
//                   <Icon
//                     className="uk-text-primary ent-quote-after"
//                     name="quote-right"
//                     ratio={1.2}
//                     flip
//                   />
//                   <span className="uk-margin-small-left uk-margin-small-right">
//                     {cv.catchphrase}
//                   </span>
//                   <Icon
//                     className="uk-text-primary ent-quote-before"
//                     name="quote-right"
//                     ratio={0.8}
//                   />
//                 </h4>
//               </div>
//             )}
//             {/* uk-text-emphasis uk-text-bold */}
//             {showCareerPathSentence && (
//               <h4
//                 className="uk-width-xxlarge uk-margin-auto"
//                 style={{ fontWeight: 500 }}
//               >
//                 <CVCareerPathSentence
//                   ambitions={cv.ambitions}
//                   businessLines={cv.businessLines}
//                 />
//               </h4>
//             )}
//             <div className="uk-position-relative">
//               <div className="uk-margin-small-bottom">
//                 <a
//                   href="#cv-fiche"
//                   data-uk-scroll="offset: 80"
//                   className={actionDisabled ? 'uk-disabled' : undefined}
//                 >
//                   <Icon
//                     name="triangle-down"
//                     className={
//                       actionDisabled ? 'uk-text-muted' : 'uk-text-primary'
//                     }
//                     ratio="2"
//                   />
//                 </a>
//               </div>
//               <Grid childWidths={['1-1']}>{/* {shareSection} */}</Grid>
//             </div>
//           </div>
//           <Grid gap="large" eachWidths={['expand', '1-3@m']}>
//             <Grid column>
//               {experiences && experiences.length > 0 && (
//                 <div className="">
//                   <h3 className="uk-margin-small-bottom">
//                     Mes expériences et compétences
//                   </h3>
//                   <hr className="uk-divider-small uk-margin-remove-top" />
//                   <dl className="uk-description-list">
//                     {experiences.map((exp, i) => {
//                       return (
//                         <div
//                           key={i}
//                           className={i > 0 ? 'uk-margin-small-top' : ''}
//                         >
//                           {exp.skills && (
//                             <dt style={{ display: 'block' }}>
//                               {exp.skills.map(({ name }, key) => {
//                                 return (
//                                   <span
//                                     key={key}
//                                     className="uk-label uk-text-lowercase uk-margin-small-right"
//                                   >
//                                     {name}
//                                   </span>
//                                 );
//                               })}
//                             </dt>
//                           )}
//                           <dd className="uk-margin-small-top">
//                             {formatParagraph(exp.description)}
//                           </dd>
//                         </div>
//                       );
//                     })}
//                   </dl>
//                 </div>
//               )}
//               {cv.story && (
//                 <div className="">
//                   <h3 className="uk-margin-small-bottom">Mon histoire</h3>
//                   <hr className="uk-divider-small uk-margin-remove-top" />
//                   <p className="">{formatParagraph(cv.story)}</p>
//                 </div>
//               )}
//               {/* cv.reviews */}
//               {cv.reviews && cv.reviews.length > 0 && (
//                 <div className="">
//                   <h3 className="uk-margin-small-bottom">
//                     Ils me recommandent
//                   </h3>
//                   <hr className="uk-divider-small uk-margin-remove-top" />
//                   <Grid gap="small" column>
//                     {sortByName(cv.reviews).map((review, i) => {
//                       return (
//                         <div key={i}>
//                           <Grid gap="small" column>
//                             <div>
//                               <Icon
//                                 flip
//                                 className="uk-text-primary uk-margin-small-bottom"
//                                 name="quote-right"
//                                 ratio={1.2}
//                               />
//                               <p className="uk-margin-remove">
//                                 {formatParagraph(review.text)}
//                               </p>
//                               <Grid
//                                 className="uk-margin-small-top"
//                                 eachWidths={['expand', 'auto']}
//                                 between
//                                 row
//                               >
//                                 <p className="uk-text-meta uk-margin-remove-top">
//                                   <span className="uk-text-bold">
//                                     {review.name}
//                                   </span>
//                                   , {review.status}
//                                 </p>
//                                 <Icon
//                                   className="uk-text-muted uk-width-1-1 uk-text-right"
//                                   name="quote-right"
//                                   ratio={0.8}
//                                 />
//                               </Grid>
//                             </div>
//                           </Grid>
//                         </div>
//                       );
//                     })}
//                   </Grid>
//                 </div>
//               )}
//             </Grid>
//             <Grid column gap="medium">
//               {(cv.contracts ||
//                 locations ||
//                 cv.availability ||
//                 cv.languages ||
//                 cv.transport) && (
//                 <div className="">
//                   <h3 className="uk-margin-small-bottom">
//                     Mes infos pratiques
//                   </h3>
//                   <hr className="uk-divider-small uk-margin-remove-top" />
//                   <ul className="uk-list">
//                     {cv.contracts && cv.contracts.length > 0 && (
//                       <li className="uk-flex uk-flex-middle">
//                         <Icon
//                           className="uk-text-primary uk-margin-small-right"
//                           name="file-text"
//                           style={{ width: 20 }}
//                         />{' '}
//                         <span className="uk-flex-1">
//                           {cv.contracts
//                             .map(({ name }) => {
//                               return findConstantFromValue(name, CONTRACTS)
//                                 .label;
//                             })
//                             .join(' / ')}{' '}
//                         </span>
//                       </li>
//                     )}
//                     {locations && locations.length > 0 && (
//                       <li className="uk-flex uk-flex-middle">
//                         <Icon
//                           className="uk-text-primary uk-margin-small-right"
//                           name="location"
//                           style={{ width: 20 }}
//                         />{' '}
//                         <span className="uk-flex-1">
//                           {locations
//                             .map(({ name }) => {
//                               return findConstantFromValue(
//                                 name,
//                                 DEPARTMENTS_FILTERS
//                               ).label;
//                             })
//                             .join(' / ')}
//                         </span>
//                       </li>
//                     )}
//                     {cv.availability && cv.availability.length > 0 && (
//                       <li className="uk-flex uk-flex-middle">
//                         <Icon
//                           className="uk-text-primary uk-margin-small-right"
//                           name="calendar"
//                           style={{ width: 20 }}
//                         />{' '}
//                         <span className="uk-flex-1">{cv.availability}</span>
//                       </li>
//                     )}
//                     {cv.languages && cv.languages.length > 0 && (
//                       <li className="uk-flex uk-flex-middle">
//                         <Icon
//                           className="uk-text-primary uk-margin-small-right"
//                           name="users"
//                           style={{ width: 20 }}
//                         />{' '}
//                         <span className="uk-flex-1">
//                           {cv.languages
//                             .map(({ name }) => {
//                               return name;
//                             })
//                             .join(' / ')}
//                         </span>
//                       </li>
//                     )}
//                     {cv.transport && cv.transport.length > 0 && (
//                       <li className="uk-flex uk-flex-middle">
//                         <Icon
//                           className="uk-text-primary uk-margin-small-right"
//                           name="car"
//                           style={{ width: 20 }}
//                         />{' '}
//                         <span className="uk-flex-1">{cv.transport}</span>
//                       </li>
//                     )}
//                   </ul>
//                 </div>
//               )}
//               {cv.skills && cv.skills.length > 0 && (
//                 <div className="">
//                   <h3 className="uk-margin-small-bottom">Mes atouts</h3>
//                   <hr className="uk-divider-small uk-margin-remove-top" />
//                   <ul className="uk-list">
//                     {cv.skills.map(({ name }, i) => {
//                       return (
//                         <li id={i} key={i}>
//                           {name}
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </div>
//               )}
//               {cv.passions && cv.passions.length > 0 && (
//                 <div className="">
//                   <h3 className="uk-margin-small-bottom">Mes passions</h3>
//                   <hr className="uk-divider-small uk-margin-remove-top" />
//                   <ul className="uk-list">
//                     {cv.passions.map(({ name }, i) => {
//                       return (
//                         <li id={i} key={i}>
//                           {name}
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </div>
//               )}
//             </Grid>
//           </Grid>
//           <hr />
//           <CVCallToActions
//             cv={cv}
//             updateSharesCount={updateSharesCount}
//             actionDisabled={actionDisabled}
//           />
//           {/* {shareSection} */}
//         </Grid>
//       </div>
//       <Grid column middle>
//         <p className="uk-text-center uk-width-xlarge@m">
//           Je suis accompagné(e) dans ma recherche d&apos;emploi et mon
//           intégration en entreprise par le projet LinkedOut. Pour plus
//           d&apos;information, contactez:
//           <br />
//           <SimpleLink
//             className={`uk-link-text uk-text-primary${
//               actionDisabled ? ' uk-disabled' : ''
//             }`}
//             isExternal
//             target="_blank"
//             href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
//           >
//             {process.env.MAILJET_CONTACT_EMAIL}
//           </SimpleLink>
//         </p>
//         <Img
//           alt="logo linkedout"
//           className="uk-width-small"
//           src="/static/img/linkedout_logo_orange.png"
//         />
//       </Grid>
//     </div>
//   );
// };

// CVFiche.propTypes = {
//   cv: CVShape.isRequired,
//   actionDisabled: PropTypes.bool,
// };

// CVFiche.defaultProps = {
//   actionDisabled: false,
// };
