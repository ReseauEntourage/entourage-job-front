import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios';
import _ from 'lodash';
import { addAxiosInterceptors } from './interceptor';
import {
  APIRoute,
  ContactCompany,
  ContactContactUs,
  ContactCandidate,
  ContactNewsletter,
  ExternalOpportunity,
  Opportunity,
  OpportunityJoin,
  OpportunityUserEvent,
  PutCandidate,
  Route,
  SocialMedia,
  CandidateInscription,
  Organization,
  UserDto,
} from './types';

class APIHandler {
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

  getCVRandom(params): Promise<AxiosResponse> {
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

  /// //////
  // user //
  /// //////

  // get

  getUsersMembers(params: object): Promise<AxiosResponse> {
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

  // post

  postUser(params: UserDto): Promise<AxiosResponse> {
    return this.post('/user', params);
  }

  // put

  putUser(userId: string, params: UserDto): Promise<AxiosResponse> {
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

  // delete

  deleteUser(userId: string): Promise<AxiosResponse> {
    return this.delete(`/user/${userId}`);
  }

  /// ///////////// ///
  /// organization  ///
  /// //////////// ///

  // get
  getAllOrganizations(params: {
    params: { search: string };
  }): Promise<AxiosResponse> {
    return this.get('/organization', params);
  }

  // post
  postOrganization(params: Organization): Promise<AxiosResponse> {
    return this.post('/organization', params);
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

  // post

  postOpportunity(params: Opportunity): Promise<AxiosResponse> {
    return this.post('/opportunity', params);
  }

  postExternalOpportunity(params: Opportunity): Promise<AxiosResponse> {
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
    params: Opportunity
  ): Promise<AxiosResponse> {
    return this.put(`/opportunity/${opportunityId}`, params);
  }

  putExternalOpportunity(
    opportunityId: string,
    candidateId: string,
    params: ExternalOpportunity
  ): Promise<AxiosResponse> {
    return this.put(
      `/opportunity/external/${opportunityId}/${candidateId}`,
      params
    );
  }

  putJoinOpportunity(params: OpportunityJoin): Promise<AxiosResponse> {
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

  getCampaigns() {
    return this.get(`/contact/campaigns`);
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
}

export default APIHandler;
