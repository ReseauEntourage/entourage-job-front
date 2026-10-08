import axios, {
  AxiosInstance,
  RawAxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import { DocumentNameType } from '@/src/constants';
import { AdminZone } from '@/src/constants/departements';
import { UserRoles } from '@/src/constants/users';
import { addAxiosInterceptors } from './interceptor';
import {
  AchievementProgressionEntry,
  APIRoute,
  CheckinState,
  CandidateInscription,
  ConversationCheckin,
  ContactCompany,
  ContactContactUs,
  ContactNewsletter,
  ConversationReportDto,
  ExternalCv,
  InviteCollaboratorsFromCompanyDto,
  Organization,
  OrganizationDto,
  PostAuthAutologinParams,
  PostAuthFinalizeAccountParams,
  PostAuthSendFinalizeReferedUserParams,
  PostAuthSendVerifyEmailParams,
  PostAuthVerifyOtpParams,
  PreRegistrationCompatibleProfilesResponse,
  ProfilesFilters,
  RecruitementAlertDto,
  Route,
  SocialMedia,
  SubmitCheckinAnswerParams,
  UserDto,
  UpdateCompanyDto,
  UserProfile,
  UserReferingDto,
  UserRegistrationDto,
  UserReportDto,
  CompaniesFilters,
  EventsFilters,
  User,
  WhatsappZone,
  PublicAchievement,
  CursorPage,
  HelpGroupAdminAction,
  HelpGroupAdminItem,
  HelpGroupCard,
  HelpGroupDiscussion,
  HelpGroupDiscussionItem,
  HelpGroupDiscussionView,
  HelpGroupDto,
  HelpGroupMembersPage,
  HelpGroupPage,
  HelpGroupReply,
  HelpGroupReplyView,
  HelpGroupReportDto,
  HelpGroupDiscussionDto,
  HelpGroupMessageRevisions,
  HelpGroupModerationDto,
  HelpGroupReactionEmoji,
  HelpGroupReactionResult,
  HelpGroupReactionTarget,
  HelpGroupReplyDto,
  NotificationItem,
  ReportConversationMessagesPage,
  ReportTargetDetail,
  ReportTargetItem,
  ReportTargetsParams,
  ReportTargetType,
} from './types';

export class APIHandler {
  private name: string;

  private api: AxiosInstance;

  constructor() {
    this.name = 'APIHandler';
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      paramsSerializer: { indexes: null },
    });
    addAxiosInterceptors(this.api);
  }

  private get(
    route: string,
    query: object = {},
    headers: RawAxiosRequestHeaders = {}
  ): Promise<AxiosResponse> {
    if (query && typeof query !== 'object') {
      throw new Error(
        `${this.name} get() function expects query argument to be of type Object`
      );
    }
    return this.api.get(route, { ...query, ...{ headers } });
  }

  private post<T extends APIRoute>(
    route: Route<T>,
    payload: object,
    headers?: RawAxiosRequestHeaders
  ): Promise<AxiosResponse> {
    if (payload && typeof payload !== 'object') {
      throw new Error(
        `${this.name} post() function expects payload argument to be of type Object`
      );
    }
    return this.api.post(route, payload, { headers });
  }

  private put(
    route: string,
    payload?: object,
    headers?: RawAxiosRequestHeaders
  ): Promise<AxiosResponse> {
    if (payload && typeof payload !== 'object') {
      throw new Error(
        `${this.name} put() function expects payload argument to be of type Object`
      );
    }
    return this.api.put(route, payload, { headers });
  }

  private patch(
    route: string,
    payload?: object,
    headers?: RawAxiosRequestHeaders
  ): Promise<AxiosResponse> {
    if (payload && typeof payload !== 'object') {
      throw new Error(
        `${this.name} patch() function expects payload argument to be of type Object`
      );
    }
    return this.api.patch(route, payload, { headers });
  }

  private delete(route: string, payload?: object): Promise<AxiosResponse> {
    return this.api.delete(route, payload ? { data: payload } : undefined);
  }

  /// //////
  /// cv ///
  /// //////

  // get

  getPublicCVsList(params): Promise<AxiosResponse> {
    return this.get('/users/public-cvs', {
      params,
    });
  }

  getPublicCVByUserId(userId: string, headers?): Promise<AxiosResponse> {
    return this.get(`/users/public-cvs/${userId}`, {}, headers);
  }

  getPublicAchievementById(
    achievementId: string
  ): Promise<AxiosResponse<PublicAchievement>> {
    return this.get(`/gamification/achievements/${achievementId}/public`);
  }

  /// //////
  /// events //
  /// //////
  getAllEvents(
    params: {
      offset: number;
      limit: number;
    } & EventsFilters
  ): Promise<AxiosResponse> {
    return this.get('/events', {
      params,
    });
  }

  getEvent(eventId: string): Promise<AxiosResponse> {
    return this.get(`/events/${eventId}`);
  }

  getEventParticipants(eventId: string): Promise<AxiosResponse> {
    return this.get(`/events/${eventId}/participants`);
  }

  updateEventParticipation(
    eventSalesForceId: string,
    isParticipating: boolean
  ): Promise<AxiosResponse> {
    return this.put(`/events/${eventSalesForceId}/participation`, {
      participate: isParticipating,
    });
  }

  // ///////////////////////
  //  profile-generation  //
  // ///////////////////////

  getGenerateProfileFromCV(): Promise<AxiosResponse> {
    return this.get('/profile-generation/generate-profile-from-cv');
  }

  cancelGenerateProfileFromCV(jobId: string): Promise<AxiosResponse> {
    return this.post(`/profile-generation/${jobId}/cancel`, {});
  }

  postGeneratePresentation(): Promise<
    AxiosResponse<{ description: string | null }>
  > {
    return this.post('/profile-generation/presentation', {});
  }

  // post
  postCVCount(candidateId: string, type: SocialMedia): Promise<AxiosResponse> {
    return this.post('/cv/count', { candidateId, type });
  }

  postCV(
    candidateId: string,
    cv: object,
    isFormData: boolean
  ): Promise<AxiosResponse> {
    if (isFormData) {
      return this.post(`/cv/${candidateId}`, cv, {
        'Content-Type': 'multipart/form-data',
      });
    }
    return this.post(`/cv/${candidateId}`, cv);
  }

  // put

  putCVRead(candidateId: string): Promise<AxiosResponse> {
    return this.put(`/cv/read/${candidateId}`);
  }

  /// //////////////
  /// external cv //
  /// //////////////
  postExternalCv(formData: FormData): Promise<AxiosResponse<ExternalCv>> {
    return this.post('/external-cv', formData, {
      'Content-Type': 'multipart/form-data',
    });
  }

  getExternalCvByUser(userId: string): Promise<AxiosResponse<ExternalCv>> {
    return this.get(`/external-cv/${userId}`);
  }

  deleteExternalCv(): Promise<AxiosResponse> {
    return this.delete(`/external-cv`);
  }

  /// //////
  // user //
  /// //////

  // get

  getUsersMembers(params: object): Promise<AxiosResponse<User[]>> {
    return this.get('/user/members', params);
  }

  getUserById(userId: string): Promise<AxiosResponse> {
    return this.get(`/user/${userId}`);
  }

  getPublicUserProfile(userId: string): Promise<AxiosResponse> {
    return this.get(`/user/profile/${userId}`);
  }

  getProfileCompletion(): Promise<AxiosResponse<number>> {
    return this.get(`/user/profile/completion`);
  }

  getAllUsersProfiles(
    params: ProfilesFilters & {
      offset: number;
      limit: number;
    }
  ): Promise<AxiosResponse> {
    return this.get('/user/profile', {
      params,
    });
  }

  getReferedCandidateProfiles(params: {
    offset: number;
    limit: number;
  }): Promise<AxiosResponse> {
    return this.get('/user/profile/refered', {
      params,
    });
  }

  getProfilesRecommendations(params: {
    limit: number;
    cursor?: number;
  }): Promise<AxiosResponse> {
    return this.get(`/user/profile/recommendations`, {
      params,
    });
  }

  // post
  postUser(params: UserDto): Promise<AxiosResponse> {
    return this.post('/user', params);
  }

  async postUserRegistration(
    params: UserRegistrationDto
  ): Promise<AxiosResponse<User>> {
    return this.post('/user/registration', params);
  }

  async getPreRegistrationCompatibleProfiles(params: {
    role: UserRoles;
    nudgeIds?: string[];
    businessSectorIds?: string[];
  }): Promise<AxiosResponse<PreRegistrationCompatibleProfilesResponse>> {
    return this.get('/user/registration/compatible-profiles', { params });
  }

  async postUserRefering(params: UserReferingDto): Promise<AxiosResponse> {
    return this.post('/user/refering', params);
  }

  postProfileImage(profileImage: FormData): Promise<AxiosResponse> {
    return this.post(`/user/profile/upload-image`, profileImage, {
      'Content-Type': 'multipart/form-data',
    });
  }

  // put

  putUser(userId: string, params: Partial<UserDto>): Promise<AxiosResponse> {
    return this.put(`/user/${userId}`, params);
  }

  putUserChangePwd(params: {
    newPassword: string;
    oldPassword: string;
  }): Promise<AxiosResponse> {
    return this.put(`/user/changePwd`, params);
  }

  putUserProfile(
    userId: string,
    userProfile: Partial<UserProfile>
  ): Promise<AxiosResponse> {
    return this.put(`/user/profile/${userId}`, userProfile);
  }

  putUserCompany(companyName: string | null): Promise<AxiosResponse> {
    return this.put(`/user/company`, { companyName });
  }

  getLinkedinOAuthUrl(
    redirectAfterShare?: string
  ): Promise<AxiosResponse<{ url: string }>> {
    const params = redirectAfterShare
      ? `?redirectAfterShare=${redirectAfterShare}`
      : '';
    return this.get(`/auth/linkedin/url${params}`);
  }

  deleteLinkedinLink(): Promise<AxiosResponse> {
    return this.delete(`/auth/linkedin`);
  }

  postLinkedinShare(
    profileUserId: string,
    customText?: string
  ): Promise<AxiosResponse<{ success: boolean; linkedinPostUrl: string }>> {
    return this.post(`/linkedin/share/${profileUserId}`, { customText });
  }

  postProfileShare(
    profileUserId: string,
    channel: 'linkedin' | 'whatsapp',
    postUrl?: string
  ): Promise<AxiosResponse<{ success: boolean; shareId: string }>> {
    return this.post(`/user/profile/${profileUserId}/shares`, {
      channel,
      postUrl,
    });
  }

  getProfileShareText(
    profileUserId: string,
    channel?: 'linkedin' | 'default'
  ): Promise<AxiosResponse<{ text: string }>> {
    const params = channel ? `?channel=${channel}` : '';
    return this.get(`/user/profile/${profileUserId}/share-text${params}`);
  }

  exchangeLinkedInCode(
    code: string,
    state: string
  ): Promise<AxiosResponse<{ pendingShare?: string }>> {
    return this.post('/auth/linkedin/exchange', { code, state });
  }

  postProfileUserAbuse(
    userId: string,
    userReportDto: UserReportDto
  ): Promise<AxiosResponse> {
    return this.post(`/user/profile/${userId}/report`, userReportDto);
  }

  // Social Situation
  getUserSocialSituation(): Promise<AxiosResponse> {
    return this.get(`/users/social-situations`);
  }

  updateUserSocialSituation(
    userId: string,
    socialSituationDto: {
      nationality?: string;
      accommodation?: string;
      resources?: string;
      studiesLevel?: string;
      workingExperience?: string;
      jobSearchDuration?: string;
      hasCompletedSurvey?: boolean;
    }
  ): Promise<AxiosResponse> {
    return this.put(`/users/social-situations/${userId}`, socialSituationDto);
  }

  // delete
  deleteUser(userId: string): Promise<AxiosResponse> {
    return this.delete(`/user/${userId}`);
  }

  /// //////////// ///
  /// Departments ///
  /// ////////// ///

  getAllDepartments(params: { search: string }): Promise<AxiosResponse> {
    return this.get('/departments', { params });
  }

  /// ///////////////// ///
  /// businessSectors  ///
  /// /////////////// ///

  getAllBusinessSectors(params: {
    limit: number;
    offset: number;
    search?: string;
  }): Promise<AxiosResponse> {
    return this.get('/business-sectors', { params });
  }

  /// /////////// ///
  /// languages  ///
  /// ///////// ///

  getAllLanguages(params: {
    limit: number;
    offset: number;
    search?: string;
  }): Promise<AxiosResponse> {
    return this.get('/languages', { params });
  }

  /// ///////////// ///
  ///  contracts  ///
  /// //////////// ///
  getAllContracts(params: {
    limit: number;
    offset: number;
    search?: string;
  }): Promise<AxiosResponse> {
    return this.get('/contracts', { params });
  }

  /// ///////// ///
  ///  nudges  ///
  /// //////// ///

  getAllNudges(params: {
    limit: number;
    offset: number;
    search?: string;
  }): Promise<AxiosResponse> {
    return this.get('/nudges', { params });
  }

  /// ///////// ///
  ///  Skills  ///
  /// //////// ///

  getAllSkills(params: {
    limit: number;
    offset: number;
    search?: string;
  }): Promise<AxiosResponse> {
    return this.get('/skills', { params });
  }

  /// /////////// ///
  /// companies  ///
  /// ///////// ///
  getAllCompanies(
    params: CompaniesFilters & {
      limit: number;
      offset: number;
    }
  ): Promise<AxiosResponse> {
    return this.get('/companies', { params });
  }

  getCompanyById(companyId: string): Promise<AxiosResponse> {
    return this.get(`/companies/${companyId}`);
  }

  getCompanyByIdWithUsersAndPendingInvitations(
    companyId: string
  ): Promise<AxiosResponse> {
    return this.get(`/companies/${companyId}/collaborators`);
  }

  updateCompany(companyFields: UpdateCompanyDto): Promise<AxiosResponse> {
    return this.put(`/companies`, companyFields);
  }

  updateCompanyLogo(formData: FormData): Promise<AxiosResponse> {
    return this.post(`/companies/logo`, formData, {
      'Content-Type': 'multipart/form-data',
    });
  }

  /// /////////////////// ///
  /// recruitement alert  ///
  /// /////////////////// ///

  getRecruitementAlerts(): Promise<AxiosResponse> {
    return this.get(`/recruitement-alerts`);
  }

  getRecruitementAlertMatching(alertId: string): Promise<AxiosResponse> {
    return this.get(`/recruitement-alerts/${alertId}/matching`, {});
  }

  createRecruitementAlert(
    params: RecruitementAlertDto
  ): Promise<AxiosResponse> {
    return this.post('/recruitement-alerts', params);
  }

  deleteRecruitementAlert(alertId: string): Promise<AxiosResponse> {
    return this.delete(`/recruitement-alerts/${alertId}`);
  }

  updateRecruitementAlert(
    alertId: string,
    params: RecruitementAlertDto
  ): Promise<AxiosResponse> {
    return this.put(`/recruitement-alerts/${alertId}`, params);
  }

  inviteCollaboratorsFromCompany(
    companyId: string,
    params: InviteCollaboratorsFromCompanyDto
  ): Promise<AxiosResponse> {
    return this.post(`/companies/${companyId}/invite-collaborators`, params);
  }

  /// ////////////// ///
  /// notifications  ///
  /// ////////////// ///

  getNotifications(params: {
    cursor?: string;
  }): Promise<AxiosResponse<CursorPage<NotificationItem>>> {
    return this.get('/notifications', { params });
  }

  getNotificationsUnseenCount(): Promise<AxiosResponse<{ count: number }>> {
    return this.get('/notifications/unseen-count');
  }

  postNotificationsSeen(params: {
    messageIds: string[];
  }): Promise<AxiosResponse> {
    return this.post('/notifications/seen', params);
  }

  /// //////////// ///
  /// help groups  ///
  /// //////////// ///

  getHelpGroups(): Promise<AxiosResponse<HelpGroupCard[]>> {
    return this.get('/help-groups');
  }

  getHelpGroup(slug: string): Promise<AxiosResponse<HelpGroupPage>> {
    return this.get(`/help-groups/${encodeURIComponent(slug)}`);
  }

  getHelpGroupDiscussions(
    slug: string,
    params: { cursor?: string; limit?: number }
  ): Promise<AxiosResponse<CursorPage<HelpGroupDiscussionItem>>> {
    return this.get(`/help-groups/${encodeURIComponent(slug)}/discussions`, {
      params,
    });
  }

  /**
   * Current members of a group, from the most recent arrival. `search` is
   * matched against the first name only, `role` is a `UserRoles` value.
   */
  getHelpGroupMembers(
    slug: string,
    params: { page: number; limit: number; search?: string; role?: UserRoles }
  ): Promise<AxiosResponse<HelpGroupMembersPage>> {
    return this.get(`/help-groups/${encodeURIComponent(slug)}/members`, {
      params,
    });
  }

  getHelpGroupDiscussion(
    slug: string,
    discussionId: string
  ): Promise<AxiosResponse<HelpGroupDiscussionView>> {
    return this.get(
      `/help-groups/${encodeURIComponent(slug)}/discussions/${encodeURIComponent(discussionId)}`
    );
  }

  getHelpGroupDiscussionReplies(
    slug: string,
    discussionId: string,
    params: { after?: string; limit?: number }
  ): Promise<AxiosResponse<CursorPage<HelpGroupReplyView>>> {
    return this.get(
      `/help-groups/${encodeURIComponent(slug)}/discussions/${encodeURIComponent(discussionId)}/replies`,
      { params }
    );
  }

  postHelpGroupMembership(slug: string): Promise<AxiosResponse> {
    return this.post(`/help-groups/${encodeURIComponent(slug)}/membership`, {});
  }

  deleteHelpGroupMembership(slug: string): Promise<AxiosResponse> {
    return this.delete(`/help-groups/${encodeURIComponent(slug)}/membership`);
  }

  patchHelpGroupMembership(
    slug: string,
    params: { emailsEnabled: boolean }
  ): Promise<AxiosResponse<{ emailsEnabled: boolean }>> {
    return this.patch(
      `/help-groups/${encodeURIComponent(slug)}/membership`,
      params
    );
  }

  postHelpGroupDiscussion(
    slug: string,
    params: HelpGroupDiscussionDto
  ): Promise<AxiosResponse<HelpGroupDiscussion>> {
    return this.post(
      `/help-groups/${encodeURIComponent(slug)}/discussions`,
      params
    );
  }

  postHelpGroupTitleSuggestion(
    slug: string,
    params: { content: string; previousTitles?: string[] }
  ): Promise<AxiosResponse<{ title: string | null }>> {
    return this.post(
      `/help-groups/${encodeURIComponent(slug)}/discussions/title-suggestions`,
      params
    );
  }

  patchHelpGroupDiscussion(
    slug: string,
    discussionId: string,
    params: { title?: string; content?: string }
  ): Promise<AxiosResponse<HelpGroupDiscussion>> {
    return this.patch(
      `/help-groups/${encodeURIComponent(slug)}/discussions/${encodeURIComponent(discussionId)}`,
      params
    );
  }

  deleteHelpGroupDiscussion(
    slug: string,
    discussionId: string
  ): Promise<AxiosResponse> {
    return this.delete(
      `/help-groups/${encodeURIComponent(slug)}/discussions/${encodeURIComponent(discussionId)}`
    );
  }

  postHelpGroupReply(
    slug: string,
    discussionId: string,
    params: HelpGroupReplyDto
  ): Promise<AxiosResponse<HelpGroupReply>> {
    return this.post(
      `/help-groups/${encodeURIComponent(slug)}/discussions/${encodeURIComponent(discussionId)}/replies`,
      params
    );
  }

  patchHelpGroupReply(
    slug: string,
    discussionId: string,
    replyId: string,
    params: { content: string }
  ): Promise<AxiosResponse<HelpGroupReply>> {
    return this.patch(
      `/help-groups/${encodeURIComponent(slug)}/discussions/${encodeURIComponent(discussionId)}/replies/${encodeURIComponent(replyId)}`,
      params
    );
  }

  deleteHelpGroupReply(
    slug: string,
    discussionId: string,
    replyId: string
  ): Promise<AxiosResponse> {
    return this.delete(
      `/help-groups/${encodeURIComponent(slug)}/discussions/${encodeURIComponent(discussionId)}/replies/${encodeURIComponent(replyId)}`
    );
  }

  putHelpGroupReaction(
    slug: string,
    discussionId: string,
    params: { target: HelpGroupReactionTarget; emoji: HelpGroupReactionEmoji }
  ): Promise<AxiosResponse<HelpGroupReactionResult>> {
    return this.put(
      `/help-groups/${encodeURIComponent(slug)}/discussions/${encodeURIComponent(discussionId)}/reactions`,
      params
    );
  }

  deleteHelpGroupReaction(
    slug: string,
    discussionId: string,
    params: { target: HelpGroupReactionTarget }
  ): Promise<AxiosResponse<HelpGroupReactionResult>> {
    return this.delete(
      `/help-groups/${encodeURIComponent(slug)}/discussions/${encodeURIComponent(discussionId)}/reactions`,
      params
    );
  }

  postHelpGroupReport(
    slug: string,
    discussionId: string,
    params: HelpGroupReportDto
  ): Promise<AxiosResponse<{ id: string }>> {
    return this.post(
      `/help-groups/${encodeURIComponent(slug)}/discussions/${encodeURIComponent(discussionId)}/reports`,
      params
    );
  }

  postAdminHelpGroupMessageRestore(
    kind: 'discussions' | 'replies',
    id: string
  ): Promise<AxiosResponse> {
    return this.post(
      `/admin/help-groups/${kind}/${encodeURIComponent(id)}/restore`,
      {}
    );
  }

  deleteAdminHelpGroupMessage(
    kind: 'discussions' | 'replies',
    id: string,
    params: HelpGroupModerationDto
  ): Promise<AxiosResponse> {
    return this.delete(
      `/admin/help-groups/${kind}/${encodeURIComponent(id)}`,
      params
    );
  }

  getAdminHelpGroupMessageRevisions(
    kind: 'discussions' | 'replies',
    id: string
  ): Promise<AxiosResponse<HelpGroupMessageRevisions>> {
    return this.get(
      `/admin/help-groups/${kind}/${encodeURIComponent(id)}/revisions`
    );
  }

  getAdminHelpGroups(
    deleted: boolean
  ): Promise<AxiosResponse<HelpGroupAdminItem[]>> {
    return this.get('/admin/help-groups', { params: { deleted } });
  }

  postAdminHelpGroup(params: HelpGroupDto): Promise<AxiosResponse> {
    return this.post('/admin/help-groups', params);
  }

  putAdminHelpGroup(id: string, params: HelpGroupDto): Promise<AxiosResponse> {
    return this.put(`/admin/help-groups/${id}`, params);
  }

  postAdminHelpGroupAction(
    id: string,
    action: HelpGroupAdminAction
  ): Promise<AxiosResponse> {
    return this.post(`/admin/help-groups/${id}/${action}`, {});
  }

  deleteAdminHelpGroup(id: string): Promise<AxiosResponse> {
    return this.delete(`/admin/help-groups/${id}`);
  }

  /// //////////////// ///
  /// reports (admin)  ///
  /// //////////////// ///

  getAdminReportTargets(
    params: ReportTargetsParams
  ): Promise<AxiosResponse<CursorPage<ReportTargetItem>>> {
    return this.get('/admin/reports/targets', { params });
  }

  getAdminReportTarget(
    targetType: ReportTargetType,
    targetId: string
  ): Promise<AxiosResponse<ReportTargetDetail>> {
    return this.get(
      `/admin/reports/targets/${targetType}/${encodeURIComponent(targetId)}`
    );
  }

  getAdminReportedConversationMessages(
    conversationId: string,
    before?: string
  ): Promise<AxiosResponse<ReportConversationMessagesPage>> {
    return this.get(
      `/admin/reports/targets/CONVERSATION/${encodeURIComponent(conversationId)}/messages`,
      { params: before ? { before } : {} }
    );
  }

  postAdminReportTargetResolve(
    targetType: ReportTargetType,
    targetId: string,
    params: { note?: string }
  ): Promise<AxiosResponse<{ resolvedCount: number }>> {
    return this.post(
      `/admin/reports/targets/${targetType}/${encodeURIComponent(targetId)}/resolve`,
      params
    );
  }

  getAdminReportsPendingCount(
    zone?: AdminZone | null
  ): Promise<AxiosResponse<{ count: number }>> {
    return this.get('/admin/reports/pending-count', {
      params: zone ? { zone } : {},
    });
  }

  /// ///////////// ///
  /// organization  ///
  /// //////////// ///

  // get
  getAllOrganizations(params: {
    params: {
      limit: number;
      offset: number;
      search?: string;
      zone?: AdminZone | AdminZone[];
    };
  }): Promise<AxiosResponse<Organization[]>> {
    return this.get('/organization', params);
  }

  // post
  postOrganization(params: OrganizationDto): Promise<AxiosResponse> {
    return this.post('/organization', params);
  }

  // put
  putOrganization(
    organizationId: string,
    params: OrganizationDto
  ): Promise<AxiosResponse> {
    return this.put(`/organization/${organizationId}`, params);
  }

  /// //////
  // auth //
  /// //////

  // get

  getResetUserToken(userId: string, token: string): Promise<AxiosResponse> {
    return this.get(`/auth/reset/${userId}/${token}`);
  }

  // post

  postAuthLogin(params: {
    email: string;
    password: string;
  }): Promise<AxiosResponse> {
    return this.post('/auth/login', params);
  }

  postAuthVerifyEmailToken(params: { token: string }): Promise<AxiosResponse> {
    return this.post('/auth/verify-email', params);
  }

  postAuthSendVerifyEmail(
    params: PostAuthSendVerifyEmailParams
  ): Promise<AxiosResponse> {
    return this.post('/auth/send-verify-email', params);
  }

  postAuthVerifyOtp(
    params: PostAuthVerifyOtpParams
  ): Promise<AxiosResponse<{ token: string }>> {
    return this.post('/auth/verify-otp', params);
  }

  postAuthFinalizeAccount(
    params: PostAuthFinalizeAccountParams
  ): Promise<AxiosResponse<string>> {
    return this.post('/auth/finalize-account', params);
  }

  postAuthSendFinalizeReferedUser(
    params: PostAuthSendFinalizeReferedUserParams
  ): Promise<AxiosResponse> {
    return this.post('/auth/send-finalize-refered-user', params);
  }

  postAuthAutologin(
    params: PostAuthAutologinParams
  ): Promise<AxiosResponse<{ token: string }>> {
    return this.post('/auth/autologin', params);
  }

  // no logout?
  // postAuthLogout(params) {
  //   return this.post('')
  // }

  postAuthForgot(params: { email: string }): Promise<AxiosResponse> {
    return this.post('/auth/forgot', params);
  }

  postResetUserToken(
    userId: string,
    token: string,
    params: { newPassword: string; confirmPassword: string }
  ): Promise<AxiosResponse> {
    return this.post(`/auth/reset/${userId}/${token}`, params);
  }

  /// // //////
  // currentUser /
  /// // //////

  getCurrentIdentity(
    headers: RawAxiosRequestHeaders | undefined = undefined
  ): Promise<AxiosResponse> {
    return this.get(`/current`, {}, headers);
  }

  getCurrentProfile(): Promise<AxiosResponse> {
    return this.get(`/current/profile`);
  }

  getCurrentProfileComplete(
    headers: RawAxiosRequestHeaders | undefined = undefined
  ): Promise<AxiosResponse> {
    return this.get(`/current/profile/complete`, {}, headers);
  }

  getCurrentCompany(): Promise<AxiosResponse> {
    return this.get(`/current/company`);
  }

  getCurrentOrganization(): Promise<AxiosResponse> {
    return this.get(`/current/organization`);
  }

  getCurrentStats(): Promise<AxiosResponse> {
    return this.get(`/current/stats`);
  }

  getCurrentWhatsappZone(): Promise<AxiosResponse<WhatsappZone>> {
    return this.get(`/current/whatsapp-zone`);
  }

  getCurrentStaffContact(
    headers: RawAxiosRequestHeaders | undefined = undefined
  ): Promise<AxiosResponse> {
    return this.get(`/current/staff-contact`, {}, headers);
  }

  getCurrentReferredUsers(): Promise<AxiosResponse> {
    return this.get(`/current/referred-users`);
  }

  getCurrentReferrer(): Promise<AxiosResponse> {
    return this.get(`/current/referrer`);
  }

  getCurrentAchievements(): Promise<AxiosResponse> {
    return this.get(`/current/achievements`);
  }

  getCurrentReadDocuments(): Promise<AxiosResponse> {
    return this.get(`/current/read-documents`);
  }

  getAchievementProgression(): Promise<
    AxiosResponse<AchievementProgressionEntry[]>
  > {
    return this.get(`/gamification/achievement-progression`);
  }

  /// // //////
  // contact /
  /// // //////

  getCandidateCampaigns(): Promise<AxiosResponse> {
    return this.get(`/contact/campaigns/candidate`);
  }

  getCoachCampaigns(): Promise<AxiosResponse> {
    return this.get(`/contact/campaigns/coach`);
  }

  postContactContactUs(params: ContactContactUs): Promise<AxiosResponse> {
    return this.post('/contact/contactUs', params);
  }

  postContactCompany(params: ContactCompany): Promise<AxiosResponse> {
    return this.post('/contact/company', params);
  }

  postNewsletter(params: ContactNewsletter): Promise<AxiosResponse> {
    return this.post('/contact/newsletter', params);
  }

  postInscriptionCandidate(
    params: CandidateInscription
  ): Promise<AxiosResponse> {
    return this.post('/contact/candidateInscription', params);
  }

  // ////////////
  // messaging //
  // ////////////
  getConversations(): Promise<AxiosResponse> {
    return this.get(`/messaging/conversations`);
  }

  getConversationMedias(conversationId: string): Promise<AxiosResponse> {
    return this.get(`/messaging/conversations/${conversationId}/medias`);
  }

  getUnseenConversationsCount(): Promise<AxiosResponse> {
    return this.get('/messaging/conversations/unseen-count');
  }

  getConversationById(
    conversationId: string,
    cursor?: { before?: string; after?: string }
  ): Promise<AxiosResponse> {
    const params = new URLSearchParams();
    if (cursor?.before) {
      params.set('before', cursor.before);
    }
    if (cursor?.after) {
      params.set('after', cursor.after);
    }
    const query = params.toString();
    return this.get(
      `/messaging/conversations/${conversationId}${query ? `?${query}` : ''}`
    );
  }

  markConversationSeen(conversationId: string): Promise<AxiosResponse> {
    return this.post(`/messaging/conversations/${conversationId}/seen`, {});
  }

  postMessage(formData: FormData): Promise<AxiosResponse> {
    return this.post('/messaging/messages', formData, {
      'Content-Type': 'multipart/form-data',
    });
  }

  postMailingList(params: {
    recipientEmails: string[];
    content: string;
  }): Promise<AxiosResponse> {
    return this.post('/messaging/mailing-lists', params);
  }

  reportMessage(conversationId: string, params: ConversationReportDto) {
    return this.post(
      `/messaging/conversations/${conversationId}/report`,
      params
    );
  }

  archiveConversation(conversationId: string): Promise<AxiosResponse> {
    return this.post(`/messaging/conversations/${conversationId}/archive`, {});
  }

  unarchiveConversation(conversationId: string): Promise<AxiosResponse> {
    return this.post(
      `/messaging/conversations/${conversationId}/unarchive`,
      {}
    );
  }

  /// ////////
  // checkin //
  /// ////////

  getCheckin(conversationId: string): Promise<AxiosResponse<CheckinState>> {
    return this.get(`/checkin/${conversationId}`);
  }

  submitCheckinAnswer(
    conversationId: string,
    params: SubmitCheckinAnswerParams
  ): Promise<AxiosResponse<ConversationCheckin>> {
    return this.put(`/checkin/${conversationId}`, params);
  }

  postCheckinContactRequest(
    conversationId: string
  ): Promise<AxiosResponse<ConversationCheckin>> {
    return this.post(`/checkin/${conversationId}/contact-request`, {});
  }

  postCheckinNote(
    conversationId: string,
    content: string
  ): Promise<AxiosResponse<ConversationCheckin>> {
    return this.post(`/checkin/${conversationId}/note`, { content });
  }

  /// ////////////////
  // AI Assistant  //
  /// ////////////////

  getAISession(conversationId: string): Promise<AxiosResponse> {
    return this.get(`/ai-assistant/conversations/${conversationId}/session`);
  }

  streamAIMessage(conversationId: string, message: string): Promise<Response> {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('access-token')
        : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ai-assistant/conversations/${conversationId}/stream`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ message }),
      }
    );
  }

  resetAISession(conversationId: string): Promise<AxiosResponse> {
    return this.delete(
      `/ai-assistant/conversations/${conversationId}/session/messages`
    );
  }

  /// /////////////////
  // read documents //
  /// ////////////////

  postReadDocument(
    params: { documentName: DocumentNameType },
    userId: string
  ): Promise<AxiosResponse> {
    return this.post(`/readDocuments/read/${userId}`, params);
  }

  // ////////// //
  // Elearning //
  // ///////// //
  getAllElearningUnits(params: {
    limit: number;
    offset: number;
    role?: string;
  }): Promise<AxiosResponse> {
    return this.get('/elearning/units', {
      params,
    });
  }

  postElearningCompletion(unitId: string): Promise<AxiosResponse> {
    return this.post(`/elearning/units/${unitId}/completions`, {});
  }

  // ///////// //
  // Version  //
  // ///////// //
  getVersion(): Promise<
    AxiosResponse<{ version: string; release: string | null }>
  > {
    return this.get('/version');
  }
}
