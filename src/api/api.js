import axios from 'axios';
import { opportunitySchema } from 'src/api/schemas';
import { addAxiosInterceptors } from './interceptor';

class APIHandler {
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

  static #get(route, query) {
    let queryString = '';
    if (query) {
      if (typeof query !== 'object') {
        throw new Error(
          `${this.name} get() function expects query argument to be of type Object`
        );
      }
      const keyCount = Object.keys(query).length;
      let count = 0;
      Object.keys(query).forEach((key) => {
        if (!count) queryString += '?';
        if (count && count < keyCount) queryString += '&';
        queryString += `${key}=${query[key]}`;
        count += 1;
      });
      return this.api.get(route + (queryString || ''));
    }
    return this.api.get(route + (queryString || ''));
  }

  static #post(route, payload) {
    if (payload && typeof payload !== 'object') {
      throw new Error(
        `${this.name} post() function expects payload argument to be of type Object`
      );
    }
    return this.api.post(route, payload);
  }

  static #put(route, payload) {
    if (payload && typeof payload !== 'object') {
      throw new Error(
        `${this.name} post() function expects payload argument to be of type Object`
      );
    }
    return this.api.post(route, payload);
  }

  static #delete(route) {
    return this.api.delete(route);
  }

  /// //////
  /// cv ///
  /// //////

  // get

  getCVShares() {
    return this.get('cv/shares');
  }

  getCVCount() {
    return this.get('cv/count');
  }

  getCVByCandidateId(candidateId) {
    return this.get(`cv/${candidateId}`);
  }

  getCVRandom(params) {
    return this.get('cv/cards/random', params);
  }

  getCVLastVersion(candidateId) {
    return this.get(`cv/lastVersion/${candidateId}`);
  }

  getCVPdf(candidateId, params) {
    return this.get(`cv/pdf/${candidateId}`, params);
  }

  getNbCVPublished() {
    return this.get('cv/published');
  }

  getCheckUpdate() {
    return this.get('cv/checkUpdate');
  }

  getCVByUrl(url) {
    return this.get(`cv/url/${url}`);
  }

  // post

  postCVCount(candidateId, type) {
    return this.post('cv/count', { candidateId, type });
  }

  postCV(candidateId, cv, isFormData) {
    if (isFormData) {
      return this.post(`/cv/${candidateId}`, cv, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return this.post(`/cv/${candidateId}`, cv);
  }

  postCVByCandidateId(candidateId) {
    return this.post(`cv/${candidateId}`);
  }

  // put

  putCVRead(candidateId) {
    return this.put(`/cv/read/${candidateId}`);
  }

  /// //////
  // user //
  /// //////

  // get

  getUsersMembers(params) {
    this.get('/user/members', params);
  }

  getUsersMembersCount() {
    this.get('/user/members/count');
  }

  getUsersSearchCandidates(params) {
    this.get('/user/search/candidates', params);
  }

  getUsersSearch(params) {
    this.get('/user/search', params);
  }

  getCandidateById(params) {
    this.get('/user/candidate', params);
  }

  getUserById(userId) {
    this.get(`/user/${userId}`);
  }

  getCandidateCheckUpdate() {
    return this.get(`/user/candidate/checkUpdate`);
  }

  // post

  postUser(params) {
    return this.post('');
  }

  /// //////
  /// opp //
  /// //////

  // get

  getOpportunityAdmin(params) {
    return this.get('/opportunity/admin', params);
  }

  getUserPrivateOpportunities(candidateId) {
    return this.get(`/opporunity/user/private/${candidateId}`);
  }

  getAllCandidateOpportunities(candidateId) {
    return this.get(`/opportunity/user/all/${candidateId}`);
  }

  getOpportunitiesAdminCount() {
    return this.get('/oppotunity/admin/count');
  }

  getOpportunitiesUserCount(candidateId) {
    return this.get(`/opportunity/user/count${candidateId}`);
  }

  getOpportunityById(opportunityId) {
    return this.get(`/opportunity/${opportunityId}`);
  }

  // post

  postOpportunity(params) {
    return this.post('/opportunity', params);
  }

  postExternalOpportunity(params) {
    return this.post('/opportunity/external', params);
  }

  postJoinOpportunity(params) {
    return this.post('/opportunity/join', params);
  }

  // put

  putOpportunity(params) {
    opportunitySchema.isValid(params).then((valid) => {
      if (valid) {
        return this.put('/opportunity', params);
      }
      return valid;
    });
  }

  putExternalOpportunity(params) {
    return this.put('/opportunity/external', params);
  }

  putJoinOpportunity(params) {
    return this.put('/opportunity/join', params);
  }

  putBulkOpportunities(params) {
    return this.put('/opportunity/bulk', params);
  }
}

export default APIHandler;
