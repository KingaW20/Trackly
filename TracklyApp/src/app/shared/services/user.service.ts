import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Paths } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseURL: string = environment.apiBaseUrl

  constructor(private http: HttpClient) { }

  getUserProfile() {
    return this.http.get(this.baseURL + "/" + Paths.USER_PROFILE)
  }
}
