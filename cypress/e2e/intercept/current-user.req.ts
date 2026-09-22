/**
 * Intercepts all granular /current/* sub-resource endpoints with sensible defaults.
 * Call this in beforeEach for any test that visits an authenticated backoffice page.
 * Override individual intercepts after this call if a specific test needs different data.
 */
export const interceptCurrentUserSubResources = () => {
  const defaultProfile = {
    id: '00000000-0000-0000-0000-000000000001',
    hasPicture: false,
    hasExternalCv: false,
    description: null,
    linkedinUrl: null,
    department: null,
    unavailableAt: null,
    currentJob: null,
    optInRecommendations: false,
    nudges: [],
    sectorOccupations: [],
    allowPhysicalEvents: true,
    allowRemoteEvents: true,
  };

  cy.intercept('GET', '/current/staff-contact', {
    statusCode: 200,
    body: {
      name: 'Support Entourage Pro',
      email: 'support@entourage.social',
      img: '/static/img/profile-placeholder.png',
    },
  }).as('currentStaffContact');

  cy.intercept('GET', '/current/profile/complete', {
    statusCode: 200,
    body: {
      ...defaultProfile,
      experiences: [],
      formations: [],
      skills: [],
      contracts: [],
      reviews: [],
      interests: [],
      customNudges: [],
      userProfileLanguages: [],
      hasExtractedCvData: false,
    },
  }).as('currentProfileComplete');

  cy.intercept('GET', '/current/profile', {
    statusCode: 200,
    body: defaultProfile,
  }).as('currentProfile');

  cy.intercept('GET', '/current/company', {
    statusCode: 200,
    body: null,
  }).as('currentCompany');

  cy.intercept('GET', '/current/organization', {
    statusCode: 200,
    body: null,
  }).as('currentOrganization');

  cy.intercept('GET', '/current/achievements', {
    statusCode: 200,
    body: [],
  }).as('currentAchievements');

  /**
   * L'utilisateur par défaut a déjà accepté la charte éthique, comme tout
   * compte passé par l'onboarding. Sans cela, la modale de rappel de la
   * charte s'ouvrirait sur chaque conversation non répondue et son voile
   * couvrirait les éléments que les tests cherchent à cliquer. Un test qui
   * veut la modale surcharge cet intercept avec une liste vide.
   */
  cy.fixture('user-read-document-ethics-charter.json').then((readDocument) => {
    cy.intercept('GET', '/current/read-documents', {
      statusCode: 200,
      body: { readDocuments: [readDocument] },
    }).as('currentReadDocuments');
  });

  cy.intercept('POST', '/current/read-documents', {
    statusCode: 201,
    body: {},
  }).as('postReadDocument');

  cy.intercept('GET', '/current/referred-users', {
    statusCode: 200,
    body: [],
  }).as('currentReferredUsers');

  cy.intercept('GET', '/current/referrer', {
    statusCode: 200,
    body: null,
  }).as('currentReferrer');

  cy.intercept('GET', '/current/stats', {
    statusCode: 200,
    body: {
      createdAt: '2022-01-01T00:00:00.000Z',
      averageDelayResponse: null,
      responseRate: null,
      totalConversationWithMirrorRoleCount: null,
    },
  }).as('currentStats');

  cy.intercept('GET', '/current/whatsapp-zone', {
    statusCode: 200,
    body: null,
  }).as('currentWhatsappZone');
};
