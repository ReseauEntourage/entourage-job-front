import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import { DocumentNameType } from 'src/constants';
import { AdminZone } from 'src/constants/departements';
import { addAxiosInterceptors } from './interceptor';
import {
  APIRoute,
  CandidateInscription,
  CompanyDto,
  ContactCompany,
  ContactContactUs,
  ContactNewsletter,
  ConversationReportDto,
  ExternalCv,
  InviteCollaboratorsFromCompanyDto,
  Organization,
  OrganizationDto,
  PostAuthFinalizeReferedUserParams,
  PostAuthSendVerifyEmailParams,
  ProfilesFilters,
  PutCandidate,
  Route,
  SocialMedia,
  UserDto,
  UpdateCompanyDto,
  UserProfile,
  UserReferingDto,
  UserRegistrationDto,
  UserReportDto,
  UserWithUserCandidate,
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
    });
    addAxiosInterceptors(this.api);
  }

  private get(
    route: string,
    query: object = {},
    headers: AxiosRequestHeaders = {}
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
    headers?: AxiosRequestHeaders
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
    headers?: AxiosRequestHeaders
  ): Promise<AxiosResponse> {
    if (payload && typeof payload !== 'object') {
      throw new Error(
        `${this.name} put() function expects payload argument to be of type Object`
      );
    }
    return this.api.put(route, payload, { headers });
  }

  private delete(route: string): Promise<AxiosResponse> {
    return this.api.delete(route);
  }

  /// //////
  /// cv ///
  /// //////

  // get

  getPublicProfileList(params): Promise<AxiosResponse> {
    return this.get('/users/public-profiles', {
      params,
    });
  }

  getPublicProfileByCandidateId(candidateId, headers?): Promise<AxiosResponse> {
    return this.get(`/users/public-profiles/${candidateId}`, {}, headers);
  }

  getGenerateProfileFromCV(): Promise<AxiosResponse> {
    return this.get('/profile-generation/generate-profile-from-cv');
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

  getUsersMembers(
    params: object
  ): Promise<AxiosResponse<UserWithUserCandidate[]>> {
    return this.get('/user/members', params);
  }

  getUsersSearchCandidates(params: object): Promise<AxiosResponse> {
    return this.get('/user/search/candidates', params);
  }

  getUsersSearch(params: object): Promise<AxiosResponse> {
    return this.get('/user/search', params);
  }

  // can be both coach or candidate ID
  getUserCandidate(): Promise<AxiosResponse> {
    return this.get(`/user/candidate`);
  }

  getUserById(userId: string): Promise<AxiosResponse> {
    return this.get(`/user/${userId}`);
  }

  getCandidateCheckUpdate(candidateId: string): Promise<AxiosResponse> {
    return this.get(`/user/candidate/checkUpdate/${candidateId}`);
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

  getProfilesRecommendations(userId: string): Promise<AxiosResponse> {
    return this.get(`/user/profile/recommendations/${userId}`);
  }

  // post
  postUser(params: UserDto): Promise<AxiosResponse> {
    return this.post('/user', params);
  }

  async postUserRegistration(
    params: UserRegistrationDto
  ): Promise<AxiosResponse> {
    return this.post('/user/registration', params);
  }

  async postUserRefering(params: UserReferingDto): Promise<AxiosResponse> {
    return this.post('/user/refering', params);
  }

  postProfileImage(
    userId: string,
    profileImage: FormData
  ): Promise<AxiosResponse> {
    return this.post(`/user/profile/uploadImage/${userId}`, profileImage, {
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

  putBulkCandidates(params: object): Promise<AxiosResponse> {
    return this.put('/user/candidate/bulk', params);
  }

  putCandidate(
    candidateId: string,
    params: Partial<PutCandidate>
  ): Promise<AxiosResponse> {
    return this.put(`/user/candidate/${candidateId}`, params);
  }

  putCandidateRead(candidateId: string): Promise<AxiosResponse> {
    return this.put(`/user/candidate/read/${candidateId}`);
  }

  putUserProfile(
    userId: string,
    userProfile: Partial<UserProfile>
  ): Promise<AxiosResponse> {
    return this.put(`/user/profile/${userId}`, userProfile);
  }

  postProfileUserAbuse(
    userId: string,
    userReportDto: UserReportDto
  ): Promise<AxiosResponse> {
    return this.post(`/user/profile/${userId}/report`, userReportDto);
  }

  // Social Situation
  updateUserSocialSituation(
    userId: string,
    socialSituationDto: {
      nationality?: string;
      accommodation?: string;
      resources?: string[];
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

  /// /////////// ///
  /// companies  ///
  /// ///////// ///
  getAllCompanies(params: {
    params: {
      limit: number;
      offset: number;
      search?: string;
    };
  }): Promise<AxiosResponse> {
    return this.get('/companies', params);
  }

  // post
  postCompany(params: CompanyDto): Promise<AxiosResponse> {
    return this.post('/companies', params);
  }

  updateCompany(companyFields: UpdateCompanyDto): Promise<AxiosResponse> {
    return this.put(`/companies`, companyFields);
  }

  updateCompanyLogo(formData: FormData): Promise<AxiosResponse> {
    return this.post(`/companies/logo`, formData, {
      'Content-Type': 'multipart/form-data',
    });

  inviteCollaboratorsFromCompany(
    companyId: string,
    params: InviteCollaboratorsFromCompanyDto
  ): Promise<AxiosResponse> {
    return this.post(`/companies/${companyId}/invite-collaborators`, params);
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

  getAuthCurrent(
    complete = false,
    headers: AxiosRequestHeaders | undefined = undefined
  ): Promise<AxiosResponse> {
    return this.get(
      `/auth/current${complete ? '?complete=true' : ''}`,
      {},
      headers
    );
  }

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

  postAuthFinalizeReferedUser(
    params: PostAuthFinalizeReferedUserParams
  ): Promise<AxiosResponse<string>> {
    return this.post('/auth/finalize-refered-user', params);
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

  getConversationById(conversationId: string): Promise<AxiosResponse> {
    return this.get(`/messaging/conversations/${conversationId}`);
  }

  postMessage(formData: FormData): Promise<AxiosResponse> {
    return this.post('/messaging/messages', formData, {
      'Content-Type': 'multipart/form-data',
    });
  }

  reportMessage(conversationId: string, params: ConversationReportDto) {
    return this.post(
      `/messaging/conversations/${conversationId}/report`,
      params
    );
  }

  postConversationFeedback(params: {
    conversationParticipantId: string;
    rating: number | null;
  }): Promise<AxiosResponse> {
    return this.post('/messaging/conversations/feedback', params);
  }

  /// /////////////////
  // read documents //
  /// /////////////////

  postReadDocument(
    params: { documentName: DocumentNameType },
    userId: string
  ): Promise<AxiosResponse> {
    return this.post(`/readDocuments/read/${userId}`, params);
  }
}
