import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import _ from 'lodash';
import { DocumentNameType } from 'src/constants';
import { AdminZone } from 'src/constants/departements';
import { addAxiosInterceptors } from './interceptor';
import {
  APIRoute,
  CandidateInscription,
  ContactCandidate,
  ContactCompany,
  ContactContactUs,
  ContactNewsletter,
  CV,
  ExternalCv,
  ExternalMessage,
  ExternalOpportunityDto,
  InternalMessage,
  OpportunityDto,
  OpportunityJoin,
  OpportunityUserEvent,
  Organization,
  OrganizationDto,
  PostAuthSendVerifyEmailParams,
  ProfilesFilters,
  PutCandidate,
  Route,
  SocialMedia,
  UserDto,
  UserProfile,
  UserRegistrationDto,
  UserWithUserCandidate,
} from './types';

export class APIHandler {
  private name: string;

  private api: AxiosInstance;

  constructor() {
    this.name = 'APIHandler';
    this.api = axios.create({
      baseURL: `${process.env.API_URL}`,
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

  getCVShares(): Promise<AxiosResponse> {
    return this.get('/cv/shares');
  }

  getCVByCandidateId(candidateId, headers?): Promise<AxiosResponse> {
    return this.get(`/cv/${candidateId}`, {}, headers);
  }

  getCVRandom(
    params
  ): Promise<AxiosResponse<{ suggestions: boolean; cvs: CV[] }>> {
    return this.get('/cv/cards/random', params);
  }

  getCVLastVersion(candidateId): Promise<AxiosResponse> {
    return this.get(`/cv/lastVersion/${candidateId}`);
  }

  getCVPdf(candidateId, params): Promise<AxiosResponse> {
    return this.get(`/cv/pdf/${candidateId}`, params);
  }

  getNbCVPublished(): Promise<AxiosResponse> {
    return this.get('/cv/published');
  }

  getCheckUpdate(candidateId: string): Promise<AxiosResponse> {
    return this.get(`/cv/checkUpdate/${candidateId}`);
  }

  getCVByUrl(url: string): Promise<AxiosResponse> {
    return this.get(`/cv/url/${url}`);
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
  postExternalCv(form: FormData): Promise<AxiosResponse<ExternalCv>> {
    return this.post(`/user/current/external-cv`, form, {
      'Content-Type': 'multipart/form-data',
    });
  }

  getExternalCvByUser(userId: string): Promise<AxiosResponse<ExternalCv>> {
    return this.get(`/user/${userId}/external-cv`);
  }

  deleteExternalCv(): Promise<AxiosResponse> {
    return this.delete(`/user/current/external-cv`);
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

  getUsersMembersCount(): Promise<AxiosResponse> {
    return this.get('/user/members/count');
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

  putLinkUser(
    userId: string,
    userToLinkId?: string | string[]
  ): Promise<AxiosResponse> {
    return this.put(`/user/linkUser/${userId}`, { userToLinkId });
  }

  putUserProfile(
    userId: string,
    userProfile: Partial<UserProfile>
  ): Promise<AxiosResponse> {
    return this.put(`/user/profile/${userId}`, userProfile);
  }

  // delete

  deleteUser(userId: string): Promise<AxiosResponse> {
    return this.delete(`/user/${userId}`);
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
  /// opp //
  /// //////

  // get

  getOpportunityAdmin(params: object): Promise<AxiosResponse> {
    return this.get('/opportunity/admin', params);
  }

  getUserPrivateOpportunities(
    candidateId: string,
    params: object
  ): Promise<AxiosResponse> {
    return this.get(`/opportunity/candidate/private/${candidateId}`, params);
  }

  getAllCandidateOpportunities(
    candidateId: string,
    params: object
  ): Promise<AxiosResponse> {
    return this.get(`/opportunity/candidate/all/${candidateId}`, params);
  }

  getOpportunitiesAdminCount(): Promise<AxiosResponse> {
    return this.get('/opportunity/admin/count');
  }

  getOpportunitiesUserCount(candidateId: string): Promise<AxiosResponse> {
    return this.get(`/opportunity/candidate/count/${candidateId}`);
  }

  getOpportunityById(opportunityId: string): Promise<AxiosResponse> {
    return this.get(`/opportunity/${opportunityId}`);
  }

  getOpportunitiesTabCountByCandidate(
    candidateId: string
  ): Promise<AxiosResponse> {
    return this.get(`/opportunity/candidate/tabCount/${candidateId}`);
  }

  // getOpportunitiesTabCountForAdmin(
  //   params: object
  // ): Promise<AxiosResponse> {
  //   console.log(params);
  //   return this.get(`/opportunity/admin/tabCount`, params);
  // }

  // post

  postOpportunity(params: OpportunityDto): Promise<AxiosResponse> {
    return this.post('/opportunity', params);
  }

  postExternalOpportunity(
    params: ExternalOpportunityDto
  ): Promise<AxiosResponse> {
    return this.post('/opportunity/external', params);
  }

  postJoinOpportunity(params: object): Promise<AxiosResponse> {
    return this.post('/opportunity/join', params);
  }

  postOpportunityUserEvent(
    opportunityId,
    candidateId,
    event: OpportunityUserEvent
  ) {
    return this.post('/opportunity/event', {
      opportunityId,
      candidateId,
      ...event,
    });
  }

  postOpportunityContactEmployer(params: object): Promise<AxiosResponse> {
    return this.post('/opportunity/contactEmployer', params);
  }

  // put

  putOpportunity(
    opportunityId: string,
    params: Partial<OpportunityDto>
  ): Promise<AxiosResponse> {
    return this.put(`/opportunity/${opportunityId}`, params);
  }

  putExternalOpportunity(
    opportunityId: string,
    candidateId: string,
    params: Partial<ExternalOpportunityDto>
  ): Promise<AxiosResponse> {
    return this.put(
      `/opportunity/external/${opportunityId}/${candidateId}`,
      params
    );
  }

  putJoinOpportunity(params: Partial<OpportunityJoin>): Promise<AxiosResponse> {
    const filteredParams = _.pick(params, [
      'status',
      'seen',
      'bookmarked',
      'archived',
      'recommended',
      'note',
    ]);
    return this.put(
      `/opportunity/join/${params.OpportunityId}/${params.UserId}`,
      filteredParams
    );
  }

  putBulkOpportunities(params: object): Promise<AxiosResponse> {
    return this.put('/opportunity/bulk', params);
  }

  putOpportunityUserEvent(
    eventId: string,
    event: Partial<OpportunityUserEvent>
  ) {
    return this.put(`/opportunity/event/${eventId}`, event);
  }

  /// //////
  // auth //
  /// //////

  // get

  getAuthCurrent(): Promise<AxiosResponse> {
    return this.get('/auth/current');
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

  postContactCandidate(params: ContactCandidate): Promise<AxiosResponse> {
    return this.post('/contact/candidate', params);
  }

  postNewsletter(params: ContactNewsletter): Promise<AxiosResponse> {
    return this.post('/contact/newsletter', params);
  }

  postInscriptionCandidate(
    params: CandidateInscription
  ): Promise<AxiosResponse> {
    return this.post('/contact/candidateInscription', params);
  }

  /// //////////
  // message //
  /// //////////

  postExternalMessage(params: ExternalMessage): Promise<AxiosResponse> {
    return this.post('/message/external', params);
  }

  postInternalMessage(params: InternalMessage): Promise<AxiosResponse> {
    return this.post('/message/internal', params);
  }

  /// /////////////////
  // read documents //
  /// /////////////////

  postReadDocument(
    params: { documentName: DocumentNameType },
    userId
  ): Promise<AxiosResponse> {
    return this.post(`/readDocuments/read/${userId}`, params);
  }
}
