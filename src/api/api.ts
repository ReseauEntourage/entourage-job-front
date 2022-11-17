import axios, {AxiosInstance, AxiosResponse} from 'axios';
import { addAxiosInterceptors } from './interceptor';
import {
  SocialMedia,
  User,
  Opportunity,
  OpportunityJoin,
  MailContactUs,
  PutCandidate
} from './types'

class APIHandler {
  name: string;
  api: AxiosInstance;
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


  private get(route: string, query?: object):  Promise<AxiosResponse> {
    if (query && typeof query !== 'object') {
      throw new Error(
        `${this.name} get() function expects query argument to be of type Object`
      );
    }
    return this.api.get(route, query);
  }

  private post(route: string, payload: object, headers?: object):  Promise<AxiosResponse>  {
    if (payload && typeof payload !== 'object') {
      throw new Error(
        `${this.name} post() function expects payload argument to be of type Object`
      );
    }
    return this.api.post(route, payload);
  }

  private put(route: string, payload?: object):  Promise<AxiosResponse> {
    if (payload && typeof payload !== 'object') {
      throw new Error(
        `${this.name} put() function expects payload argument to be of type Object`
      );
    }
    return this.api.post(route, payload);
  }

  private delete(route: string):  Promise<AxiosResponse>  {
    return this.api.delete(route);
  }

  /// //////
  /// cv ///
  /// //////

  // get

  getCVShares():  Promise<AxiosResponse>  {
    return this.get('/cv/shares');
  }

  getCVCount():  Promise<AxiosResponse>  {
    return this.get('/cv/count');
  }

  getCVByCandidateId(candidateId):  Promise<AxiosResponse>  {
    return this.get(`/cv/${candidateId}`);
  }

  getCVRandom(params) :  Promise<AxiosResponse> {
    return this.get('/cv/cards/random', params);
  }

  getCVLastVersion(candidateId):  Promise<AxiosResponse>  {
    return this.get(`/cv/lastVersion/${candidateId}`);
  }

  getCVPdf(candidateId, params):  Promise<AxiosResponse>  {
    return this.get(`/cv/pdf/${candidateId}`, params);
  }

  getNbCVPublished():  Promise<AxiosResponse>  {
    return this.get('/cv/published');
  }

  getCheckUpdate():  Promise<AxiosResponse>  {
    return this.get('/cv/checkUpdate');
  }

  getCVByUrl(url: string) :  Promise<AxiosResponse> {
    return this.get(`/cv/url/${url}`);
  }

  // post

  postCVCount(candidateId: string, type: SocialMedia):  Promise<AxiosResponse>  {
    return this.post('/cv/count', { candidateId, type });
  }

  postCV(candidateId: string, cv: object, isFormData: boolean) :  Promise<AxiosResponse> {
    if (isFormData) {
      return this.post(`/cv/${candidateId}`, cv, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return this.post(`/cv/${candidateId}`, cv);
  }

  // put

  putCVRead(candidateId: string) :  Promise<AxiosResponse> {
    return this.put(`/cv/read/${candidateId}`);
  }

  /// //////
  // user //
  /// //////

  // get

  getUsersMembers(params: object):  Promise<AxiosResponse>  {
    return this.get('/user/members', params);
  }

  getUsersMembersCount() :  Promise<AxiosResponse> {
    return this.get('/user/members/count');
  }

  getUsersSearchCandidates(params: object) :  Promise<AxiosResponse> {
    return this.get('/user/search/candidates', params);
  }

  getUsersSearch(params: object):  Promise<AxiosResponse>  {
    return this.get('/user/search', params);
  }

  // can be both coach or candidate ID
  getCandidateById(candidateId: string):  Promise<AxiosResponse>  {
    return this.get(`/user/candidate${candidateId}`);
  }

  getUserById(userId: string) :  Promise<AxiosResponse> {
    return this.get(`/user/${userId}`);
  }

  getCandidateCheckUpdate():  Promise<AxiosResponse>  {
    return this.get(`/user/candidate/checkUpdate`);
  }

  // post

  postUser(params: User) :  Promise<AxiosResponse> {
    return this.post('/user', params);
  }

  // put

  putUser(userId: string, params: object):  Promise<AxiosResponse> {
    return this.put(`/user/${userId}`, params)
  }

  putUserChangePwd(params: {newPassword: string, oldPassword: string}):  Promise<AxiosResponse>  {
    return this.put(`/user/change-pwd`, params)
  }

  putBulkCandidates(params: object) :  Promise<AxiosResponse> {
    return this.put('/opportunity/bulk', params);
  }
  
  putCandidate(candidateId: string, params: PutCandidate) :  Promise<AxiosResponse>  {
    return this.put(`/user/candidate/${candidateId}`,params)
  }

  putCandidateRead(candidateId: string) :  Promise<AxiosResponse> {
    return this.put(`/user/candidate/read/${candidateId}`)
  }

  // delete

  deleteUser(userId: string) :  Promise<AxiosResponse> {
    return this.delete(`/user/${userId}`)
  }

  /// //////
  /// opp //
  /// //////

  // get

  getOpportunityAdmin(params: object) :  Promise<AxiosResponse>  {
    return this.get('/opportunity/admin', params);
  }

  getUserPrivateOpportunities(candidateId: string, params: object) :  Promise<AxiosResponse> {
    return this.get(`/opporunity/user/private/${candidateId}`, params);
  }

  getAllCandidateOpportunities(candidateId: string, params: object) :  Promise<AxiosResponse> {
    return this.get(`/opportunity/user/all/${candidateId}`, params);
  }

  getOpportunitiesAdminCount() :  Promise<AxiosResponse> {
    return this.get('/oppotunity/admin/count');
  }

  getOpportunitiesUserCount(candidateId: string) :  Promise<AxiosResponse> {
    return this.get(`/opportunity/user/count${candidateId}`);
  }

  getOpportunityById(opportunityId: string) :  Promise<AxiosResponse> {
    return this.get(`/opportunity/${opportunityId}`);
  }

  // post

  postOpportunity(params: Opportunity) :  Promise<AxiosResponse> {
    return this.post('/opportunity', params);
  }

  postExternalOpportunity(params: Opportunity) :  Promise<AxiosResponse> {
    return this.post('/opportunity/external', params);
  }

  postJoinOpportunity(params: object) :  Promise<AxiosResponse> {
    return this.post('/opportunity/join', params);
  }

  // put

  putOpportunity(opportunityId: string, candidateId: string,params: Opportunity) :  Promise<AxiosResponse> {
    return this.put(`/opportunity/${opportunityId}/${candidateId}`, params);
  }

  putExternalOpportunity(opportunityId: string, candidateId: string, params: Opportunity) :  Promise<AxiosResponse> {
    return this.put(`/opportunity/external/${opportunityId}/${candidateId}`, params);
  }

  putJoinOpportunity(params: OpportunityJoin) :  Promise<AxiosResponse> {
    return this.put('/opportunity/join', params);
  }

  putBulkOpportunities(params: object) :  Promise<AxiosResponse> {
    return this.put('/opportunity/bulk', params);
  }

  /// //////
  // auth //
  /// //////

  // get

  getAuthCurrent() :  Promise<AxiosResponse> {
    return this.get('/auth/current')
  }

  getResetUserToken(userId: string, token: string) :  Promise<AxiosResponse> {
    return this.get(`/auth/reset/${userId}/${token}`)
  }

  // post

  postAuthLogin(params: {email: string, password: string}) :  Promise<AxiosResponse> {
    return this.post('/auth/login', params)
  }

    // no logout?
  // postAuthLogout(params) {
  //   return this.post('')
  // }

  postAuthForgot(params: {email: string}) :  Promise<AxiosResponse> {
    return this.post('auth/forgot', params)
  }

  postResetUserToken(userId: string, token: string, params: {newPassword: string, confirmPassword: string}) :  Promise<AxiosResponse> {
    return this.post(`/auth/reset/${userId}/${token}`, params)
  }

  ///// //////
  // contact /
  ///// //////

  postContactUs(params: MailContactUs) :  Promise<AxiosResponse> {
    return this.post('/contact/contactUs', params);
  }

  postNewsletter(params: object) :  Promise<AxiosResponse> {
    return this.post('/contact/newsletter', params);
  }
}

export default APIHandler;
