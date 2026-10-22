const mockInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  interceptors: { request: { use: jest.fn() } },
};
jest.mock('axios', () => ({
  __esModule: true,
  default: { create: jest.fn(() => mockInstance) },
}));

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { APIHandler } from './api';

type Verb = 'get' | 'post' | 'put' | 'patch' | 'delete';

// [method name, kind of each argument (s: string used in the route, o: object),
//  HTTP verb, expected route ({n} is replaced by the n-th string argument)]
const ROUTES: [string, string, Verb, string][] = [
  ['getPublicCVsList', 'o', 'get', '/users/public-cvs'],
  ['getPublicCVByUserId', 'so', 'get', '/users/public-cvs/{0}'],
  [
    'getPublicAchievementById',
    's',
    'get',
    '/gamification/achievements/{0}/public',
  ],
  ['getAllEvents', 'o', 'get', '/events'],
  ['getEvent', 's', 'get', '/events/{0}'],
  ['getEventParticipants', 's', 'get', '/events/{0}/participants'],
  ['updateEventParticipation', 'so', 'put', '/events/{0}/participation'],
  [
    'getGenerateProfileFromCV',
    '',
    'get',
    '/profile-generation/generate-profile-from-cv',
  ],
  [
    'cancelGenerateProfileFromCV',
    's',
    'post',
    '/profile-generation/{0}/cancel',
  ],
  ['postGeneratePresentation', '', 'post', '/profile-generation/presentation'],
  ['postCVCount', 'oo', 'post', '/cv/count'],
  ['putCVRead', 's', 'put', '/cv/read/{0}'],
  ['postExternalCv', 'o', 'post', '/external-cv'],
  ['getExternalCvByUser', 's', 'get', '/external-cv/{0}'],
  ['deleteExternalCv', '', 'delete', '/external-cv'],
  ['getUsersMembers', 'o', 'get', '/user/members'],
  ['getUserById', 's', 'get', '/user/{0}'],
  ['getPublicUserProfile', 's', 'get', '/user/profile/{0}'],
  ['getProfileCompletion', '', 'get', '/user/profile/completion'],
  ['getAllUsersProfiles', 'o', 'get', '/user/profile'],
  ['getReferedCandidateProfiles', 'o', 'get', '/user/profile/refered'],
  ['getProfilesRecommendations', 'o', 'get', '/user/profile/recommendations'],
  ['postUser', 'o', 'post', '/user'],
  ['postUserRegistration', 'o', 'post', '/user/registration'],
  [
    'getPreRegistrationCompatibleProfiles',
    'o',
    'get',
    '/user/registration/compatible-profiles',
  ],
  ['postUserRefering', 'o', 'post', '/user/refering'],
  ['postProfileImage', 'o', 'post', '/user/profile/upload-image'],
  ['putUser', 'so', 'put', '/user/{0}'],
  ['putUserChangePwd', 'o', 'put', '/user/changePwd'],
  ['putUserProfile', 'so', 'put', '/user/profile/{0}'],
  ['putUserCompany', 'o', 'put', '/user/company'],
  ['deleteLinkedinLink', '', 'delete', '/auth/linkedin'],
  ['postLinkedinShare', 'so', 'post', '/linkedin/share/{0}'],
  ['postProfileShare', 'soo', 'post', '/user/profile/{0}/shares'],
  ['exchangeLinkedInCode', 'oo', 'post', '/auth/linkedin/exchange'],
  ['postProfileUserAbuse', 'so', 'post', '/user/profile/{0}/report'],
  ['getUserSocialSituation', '', 'get', '/users/social-situations'],
  ['updateUserSocialSituation', 'so', 'put', '/users/social-situations/{0}'],
  ['deleteUser', 's', 'delete', '/user/{0}'],
  ['getAllDepartments', 'o', 'get', '/departments'],
  ['getAllBusinessSectors', 'o', 'get', '/business-sectors'],
  ['getAllLanguages', 'o', 'get', '/languages'],
  ['getAllContracts', 'o', 'get', '/contracts'],
  ['getAllNudges', 'o', 'get', '/nudges'],
  ['getAllSkills', 'o', 'get', '/skills'],
  ['getAllCompanies', 'o', 'get', '/companies'],
  ['getCompanyById', 's', 'get', '/companies/{0}'],
  [
    'getCompanyByIdWithUsersAndPendingInvitations',
    's',
    'get',
    '/companies/{0}/collaborators',
  ],
  ['updateCompany', 'o', 'put', '/companies'],
  ['updateCompanyLogo', 'o', 'post', '/companies/logo'],
  ['getRecruitementAlerts', '', 'get', '/recruitement-alerts'],
  [
    'getRecruitementAlertMatching',
    's',
    'get',
    '/recruitement-alerts/{0}/matching',
  ],
  ['createRecruitementAlert', 'o', 'post', '/recruitement-alerts'],
  ['deleteRecruitementAlert', 's', 'delete', '/recruitement-alerts/{0}'],
  ['updateRecruitementAlert', 'so', 'put', '/recruitement-alerts/{0}'],
  [
    'inviteCollaboratorsFromCompany',
    'so',
    'post',
    '/companies/{0}/invite-collaborators',
  ],
  ['getNotifications', 'o', 'get', '/notifications'],
  ['getNotificationsUnseenCount', '', 'get', '/notifications/unseen-count'],
  ['postNotificationsSeen', 'o', 'post', '/notifications/seen'],
  ['postNotificationsSeenAll', '', 'post', '/notifications/seen-all'],
  ['getHelpGroups', '', 'get', '/help-groups'],
  ['getHelpGroup', 's', 'get', '/help-groups/{0}'],
  ['getHelpGroupDiscussions', 'so', 'get', '/help-groups/{0}/discussions'],
  ['getHelpGroupMembers', 'so', 'get', '/help-groups/{0}/members'],
  ['getHelpGroupDiscussion', 'ss', 'get', '/help-groups/{0}/discussions/{1}'],
  [
    'getHelpGroupDiscussionReplies',
    'sso',
    'get',
    '/help-groups/{0}/discussions/{1}/replies',
  ],
  ['postHelpGroupMembership', 's', 'post', '/help-groups/{0}/membership'],
  ['deleteHelpGroupMembership', 's', 'delete', '/help-groups/{0}/membership'],
  ['patchHelpGroupMembership', 'so', 'patch', '/help-groups/{0}/membership'],
  ['postHelpGroupDiscussion', 'so', 'post', '/help-groups/{0}/discussions'],
  [
    'postHelpGroupTitleSuggestion',
    'so',
    'post',
    '/help-groups/{0}/discussions/title-suggestions',
  ],
  [
    'patchHelpGroupDiscussion',
    'sso',
    'patch',
    '/help-groups/{0}/discussions/{1}',
  ],
  [
    'deleteHelpGroupDiscussion',
    'ss',
    'delete',
    '/help-groups/{0}/discussions/{1}',
  ],
  [
    'postHelpGroupReply',
    'sso',
    'post',
    '/help-groups/{0}/discussions/{1}/replies',
  ],
  [
    'patchHelpGroupReply',
    'ssso',
    'patch',
    '/help-groups/{0}/discussions/{1}/replies/{2}',
  ],
  [
    'deleteHelpGroupReply',
    'sss',
    'delete',
    '/help-groups/{0}/discussions/{1}/replies/{2}',
  ],
  [
    'putHelpGroupReaction',
    'sso',
    'put',
    '/help-groups/{0}/discussions/{1}/reactions',
  ],
  [
    'deleteHelpGroupReaction',
    'sso',
    'delete',
    '/help-groups/{0}/discussions/{1}/reactions',
  ],
  [
    'postHelpGroupReport',
    'sso',
    'post',
    '/help-groups/{0}/discussions/{1}/reports',
  ],
  [
    'postAdminHelpGroupMessageRestore',
    'ss',
    'post',
    '/admin/help-groups/{0}/{1}/restore',
  ],
  [
    'deleteAdminHelpGroupMessage',
    'sso',
    'delete',
    '/admin/help-groups/{0}/{1}',
  ],
  [
    'getAdminHelpGroupMessageRevisions',
    'ss',
    'get',
    '/admin/help-groups/{0}/{1}/revisions',
  ],
  ['getAdminHelpGroups', 'o', 'get', '/admin/help-groups'],
  ['postAdminHelpGroup', 'o', 'post', '/admin/help-groups'],
  ['putAdminHelpGroup', 'so', 'put', '/admin/help-groups/{0}'],
  ['postAdminHelpGroupAction', 'ss', 'post', '/admin/help-groups/{0}/{1}'],
  ['deleteAdminHelpGroup', 's', 'delete', '/admin/help-groups/{0}'],
  ['getAdminReportTargets', 'o', 'get', '/admin/reports/targets'],
  ['getAdminReportTarget', 'ss', 'get', '/admin/reports/targets/{0}/{1}'],
  [
    'getAdminReportedConversationMessages',
    'so',
    'get',
    '/admin/reports/targets/CONVERSATION/{0}/messages',
  ],
  [
    'postAdminReportTargetResolve',
    'sso',
    'post',
    '/admin/reports/targets/{0}/{1}/resolve',
  ],
  ['getAdminReportsPendingCount', 'o', 'get', '/admin/reports/pending-count'],
  ['getAllOrganizations', 'o', 'get', '/organization'],
  ['postOrganization', 'o', 'post', '/organization'],
  ['putOrganization', 'so', 'put', '/organization/{0}'],
  ['getResetUserToken', 'ss', 'get', '/auth/reset/{0}/{1}'],
  ['postAuthLogin', 'o', 'post', '/auth/login'],
  ['postAuthVerifyEmailToken', 'o', 'post', '/auth/verify-email'],
  ['postAuthSendVerifyEmail', 'o', 'post', '/auth/send-verify-email'],
  ['postAuthVerifyOtp', 'o', 'post', '/auth/verify-otp'],
  ['postAuthFinalizeAccount', 'o', 'post', '/auth/finalize-account'],
  [
    'postAuthSendFinalizeReferedUser',
    'o',
    'post',
    '/auth/send-finalize-refered-user',
  ],
  ['postAuthAutologin', 'o', 'post', '/auth/autologin'],
  ['postAuthForgot', 'o', 'post', '/auth/forgot'],
  ['postResetUserToken', 'sso', 'post', '/auth/reset/{0}/{1}'],
  ['getCurrentIdentity', 'o', 'get', '/current'],
  ['getCurrentProfile', '', 'get', '/current/profile'],
  ['getCurrentProfileComplete', 'o', 'get', '/current/profile/complete'],
  ['getCurrentCompany', '', 'get', '/current/company'],
  ['getCurrentOrganization', '', 'get', '/current/organization'],
  ['getCurrentStats', '', 'get', '/current/stats'],
  ['getCurrentWhatsappZone', '', 'get', '/current/whatsapp-zone'],
  ['getCurrentStaffContact', 'o', 'get', '/current/staff-contact'],
  ['getCurrentReferredUsers', '', 'get', '/current/referred-users'],
  ['getCurrentReferrer', '', 'get', '/current/referrer'],
  ['getCurrentAchievements', '', 'get', '/current/achievements'],
  ['getCurrentReadDocuments', '', 'get', '/current/read-documents'],
  [
    'getAchievementProgression',
    '',
    'get',
    '/gamification/achievement-progression',
  ],
  ['getCandidateCampaigns', '', 'get', '/contact/campaigns/candidate'],
  ['getCoachCampaigns', '', 'get', '/contact/campaigns/coach'],
  ['postContactContactUs', 'o', 'post', '/contact/contactUs'],
  ['postContactCompany', 'o', 'post', '/contact/company'],
  ['postNewsletter', 'o', 'post', '/contact/newsletter'],
  ['postInscriptionCandidate', 'o', 'post', '/contact/candidateInscription'],
  ['getConversations', '', 'get', '/messaging/conversations'],
  ['getConversationMedias', 's', 'get', '/messaging/conversations/{0}/medias'],
  [
    'getUnseenConversationsCount',
    '',
    'get',
    '/messaging/conversations/unseen-count',
  ],
  ['markConversationSeen', 's', 'post', '/messaging/conversations/{0}/seen'],
  ['postMessage', 'o', 'post', '/messaging/messages'],
  ['postMailingList', 'o', 'post', '/messaging/mailing-lists'],
  ['reportMessage', 'so', 'post', '/messaging/conversations/{0}/report'],
  ['archiveConversation', 's', 'post', '/messaging/conversations/{0}/archive'],
  [
    'unarchiveConversation',
    's',
    'post',
    '/messaging/conversations/{0}/unarchive',
  ],
  ['getCheckin', 's', 'get', '/checkin/{0}'],
  ['submitCheckinAnswer', 'so', 'put', '/checkin/{0}'],
  ['postCheckinContactRequest', 's', 'post', '/checkin/{0}/contact-request'],
  ['postCheckinNote', 'so', 'post', '/checkin/{0}/note'],
  ['getAISession', 's', 'get', '/ai-assistant/conversations/{0}/session'],
  [
    'resetAISession',
    's',
    'delete',
    '/ai-assistant/conversations/{0}/session/messages',
  ],
  ['postReadDocument', 'os', 'post', '/readDocuments/read/{1}'],
  ['getAllElearningUnits', 'o', 'get', '/elearning/units'],
  ['postElearningCompletion', 's', 'post', '/elearning/units/{0}/completions'],
  ['getVersion', '', 'get', '/version'],
];

describe('APIHandler', () => {
  let handler: APIHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.values(mockInstance).forEach((fn) => {
      if (typeof fn === 'function' && 'mockResolvedValue' in fn) {
        (fn as jest.Mock).mockResolvedValue({ data: 'ok' });
      }
    });
    handler = new APIHandler();
  });

  it('is created with the JSON headers and the auth interceptor', () => {
    const axios = require('axios').default;
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        paramsSerializer: { indexes: null },
      })
    );
    expect(mockInstance.interceptors.request.use).toHaveBeenCalledTimes(1);
  });

  describe('routes', () => {
    ROUTES.forEach(([name, kinds, verb, route]) => {
      it(`${name} calls ${verb.toUpperCase()} ${route}`, async () => {
        const args = kinds
          .split('')
          .map((kind, index) =>
            kind === 's' ? `v_${index}` : { marker: `arg_${index}` }
          );
        const expectedRoute = route.replace(/\{(\d+)\}/g, (_, i) => `v_${i}`);

        const result = await (handler as any)[name](...args);

        expect(mockInstance[verb]).toHaveBeenCalledTimes(1);
        expect(mockInstance[verb].mock.calls[0][0]).toBe(expectedRoute);
        expect(result).toEqual({ data: 'ok' });
        (['get', 'post', 'put', 'patch', 'delete'] as Verb[])
          .filter((other) => other !== verb)
          .forEach((other) =>
            expect(mockInstance[other]).not.toHaveBeenCalled()
          );
      });
    });
  });

  describe('payloads and headers', () => {
    it('sends GET query params under the "params" key with the headers', async () => {
      const params = { limit: 5 };
      await handler.getAllEvents(params as any);
      expect(mockInstance.get).toHaveBeenCalledWith('/events', {
        params,
        headers: {},
      });
    });

    it('forwards custom headers on GET requests', async () => {
      await handler.getPublicCVByUserId('u1', { 'X-Test': '1' });
      expect(mockInstance.get).toHaveBeenCalledWith('/users/public-cvs/u1', {
        headers: { 'X-Test': '1' },
      });
    });

    it('sends the body and multipart header for uploads', async () => {
      const form = new FormData();
      await handler.postProfileImage(form);
      expect(mockInstance.post).toHaveBeenCalledWith(
        '/user/profile/upload-image',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    });

    it('posts the candidate id and the social media type when counting CV views', async () => {
      await handler.postCVCount('c1', 'linkedin' as any);
      expect(mockInstance.post).toHaveBeenCalledWith(
        '/cv/count',
        { candidateId: 'c1', type: 'linkedin' },
        { headers: undefined }
      );
    });

    it('only sets the multipart header on postCV for form data', async () => {
      const cv = { a: 1 };
      await handler.postCV('c1', cv, true);
      expect(mockInstance.post).toHaveBeenLastCalledWith('/cv/c1', cv, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await handler.postCV('c1', cv, false);
      expect(mockInstance.post).toHaveBeenLastCalledWith('/cv/c1', cv, {
        headers: undefined,
      });
    });

    it('wraps single values into their expected body', async () => {
      await handler.putUserCompany('Acme');
      expect(mockInstance.put).toHaveBeenLastCalledWith(
        '/user/company',
        { companyName: 'Acme' },
        { headers: undefined }
      );
      await handler.postCheckinNote('conv', 'hello');
      expect(mockInstance.post).toHaveBeenLastCalledWith(
        '/checkin/conv/note',
        { content: 'hello' },
        { headers: undefined }
      );
      await handler.postLinkedinShare('u1', 'text');
      expect(mockInstance.post).toHaveBeenLastCalledWith(
        '/linkedin/share/u1',
        { customText: 'text' },
        { headers: undefined }
      );
      await handler.postProfileShare('u1', 'whatsapp');
      expect(mockInstance.post).toHaveBeenLastCalledWith(
        '/user/profile/u1/shares',
        { channel: 'whatsapp', postUrl: undefined },
        { headers: undefined }
      );
      await handler.exchangeLinkedInCode('code', 'state');
      expect(mockInstance.post).toHaveBeenLastCalledWith(
        '/auth/linkedin/exchange',
        { code: 'code', state: 'state' },
        { headers: undefined }
      );
      await handler.updateEventParticipation('sf1', true);
      expect(mockInstance.put).toHaveBeenLastCalledWith(
        '/events/sf1/participation',
        { participate: true },
        { headers: undefined }
      );
    });

    it('url-encodes slugs and ids in help group routes', async () => {
      await handler.getHelpGroup('a b/c');
      expect(mockInstance.get.mock.calls[0][0]).toBe('/help-groups/a%20b%2Fc');
      await handler.getHelpGroupDiscussion('s', 'd/1');
      expect(mockInstance.get.mock.calls[1][0]).toBe(
        '/help-groups/s/discussions/d%2F1'
      );
    });

    it('sends the payload of a DELETE as request data, and nothing otherwise', async () => {
      await handler.deleteUser('u1');
      expect(mockInstance.delete).toHaveBeenLastCalledWith(
        '/user/u1',
        undefined
      );
      const params = { target: 'DISCUSSION' };
      await handler.deleteHelpGroupReaction('s', 'd', params as any);
      expect(mockInstance.delete).toHaveBeenLastCalledWith(
        '/help-groups/s/discussions/d/reactions',
        { data: params }
      );
    });

    it('sends the pending-count zone only when provided', async () => {
      await handler.getAdminReportsPendingCount();
      expect(mockInstance.get).toHaveBeenLastCalledWith(
        '/admin/reports/pending-count',
        { params: {}, headers: {} }
      );
      await handler.getAdminReportsPendingCount('PARIS' as any);
      expect(mockInstance.get).toHaveBeenLastCalledWith(
        '/admin/reports/pending-count',
        { params: { zone: 'PARIS' }, headers: {} }
      );
    });

    it('sends the "before" cursor of reported conversation messages only when provided', async () => {
      await handler.getAdminReportedConversationMessages('c/1');
      expect(mockInstance.get).toHaveBeenLastCalledWith(
        '/admin/reports/targets/CONVERSATION/c%2F1/messages',
        { params: {}, headers: {} }
      );
      await handler.getAdminReportedConversationMessages('c1', 'm9');
      expect(mockInstance.get).toHaveBeenLastCalledWith(
        '/admin/reports/targets/CONVERSATION/c1/messages',
        { params: { before: 'm9' }, headers: {} }
      );
    });

    it('sends the deleted flag of admin help groups', async () => {
      await handler.getAdminHelpGroups(true);
      expect(mockInstance.get).toHaveBeenLastCalledWith('/admin/help-groups', {
        params: { deleted: true },
        headers: {},
      });
    });
  });

  describe('optional query strings', () => {
    it('adds redirectAfterShare to the LinkedIn OAuth URL only when given', async () => {
      await handler.getLinkedinOAuthUrl();
      expect(mockInstance.get.mock.calls[0][0]).toBe('/auth/linkedin/url');
      await handler.getLinkedinOAuthUrl('/profile');
      expect(mockInstance.get.mock.calls[1][0]).toBe(
        '/auth/linkedin/url?redirectAfterShare=/profile'
      );
    });

    it('adds the channel to the profile share text only when given', async () => {
      await handler.getProfileShareText('u1');
      expect(mockInstance.get.mock.calls[0][0]).toBe(
        '/user/profile/u1/share-text'
      );
      await handler.getProfileShareText('u1', 'linkedin');
      expect(mockInstance.get.mock.calls[1][0]).toBe(
        '/user/profile/u1/share-text?channel=linkedin'
      );
    });

    it('builds the conversation cursor query string', async () => {
      await handler.getConversationById('c1');
      expect(mockInstance.get.mock.calls[0][0]).toBe(
        '/messaging/conversations/c1'
      );
      await handler.getConversationById('c1', { before: 'b1' });
      expect(mockInstance.get.mock.calls[1][0]).toBe(
        '/messaging/conversations/c1?before=b1'
      );
      await handler.getConversationById('c1', { before: 'b1', after: 'a1' });
      expect(mockInstance.get.mock.calls[2][0]).toBe(
        '/messaging/conversations/c1?before=b1&after=a1'
      );
      await handler.getConversationById('c1', { after: 'a1' });
      expect(mockInstance.get.mock.calls[3][0]).toBe(
        '/messaging/conversations/c1?after=a1'
      );
    });
  });

  describe('streamAIMessage', () => {
    const originalFetch = globalThis.fetch;
    const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

    beforeEach(() => {
      globalThis.fetch = jest.fn().mockResolvedValue({ ok: true }) as any;
      process.env.NEXT_PUBLIC_API_URL = 'http://api.test';
      localStorage.clear();
    });

    afterEach(() => {
      globalThis.fetch = originalFetch;
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
      localStorage.clear();
    });

    it('posts the message with the stored bearer token', async () => {
      localStorage.setItem('access-token', 'tok');
      await handler.streamAIMessage('c1', 'hello');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://api.test/ai-assistant/conversations/c1/stream',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer tok',
          },
          body: JSON.stringify({ message: 'hello' }),
        }
      );
    });

    it('omits the Authorization header without a token', async () => {
      await handler.streamAIMessage('c1', 'hello');
      const [, options] = (globalThis.fetch as jest.Mock).mock.calls[0];
      expect(options.headers).toEqual({ 'Content-Type': 'application/json' });
    });
  });

  describe('argument validation', () => {
    it('rejects a non-object GET query', () => {
      expect(() => handler.getUsersMembers('oops' as any)).toThrow(
        'APIHandler get() function expects query argument to be of type Object'
      );
    });

    it('rejects a non-object POST payload', () => {
      expect(() => handler.postUser('oops' as any)).toThrow(
        'APIHandler post() function expects payload argument to be of type Object'
      );
    });

    it('rejects a non-object PUT payload', () => {
      expect(() => handler.putUser('u1', 'oops' as any)).toThrow(
        'APIHandler put() function expects payload argument to be of type Object'
      );
    });

    it('rejects a non-object PATCH payload', () => {
      expect(() =>
        handler.patchHelpGroupMembership('s', 'oops' as any)
      ).toThrow(
        'APIHandler patch() function expects payload argument to be of type Object'
      );
    });
  });
});
