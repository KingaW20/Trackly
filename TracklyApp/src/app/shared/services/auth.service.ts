import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from '../../../environments/environment';
import { TOKEN_KEY, Paths, Roles, Values } from '../constants';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL: string = environment.apiBaseUrl

  constructor(private http: HttpClient) { }

  createUser(formData: any) {
    //WARNING!
    //default value for Role, Gender, Age, LibraryID?
    //instead of registration form, there should be some other 
    //form to update these details of the user
    //TODO: change this to ie. 2-step form
    formData.role = Roles.REGULAR
    formData.gender = Values.FEMALE
    formData.age = 35
    return this.http.post(this.baseURL + "/" + Paths.SIGN_UP, formData);
  }

  signin(formData: any) {
    return this.http.post(this.baseURL + "/" + Paths.SIGN_IN, formData);
  }
  
  isLoggedId() {
    return this.getToken() != null;
  }

  saveToken(token: string) {    
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken() {    
    return localStorage.getItem(TOKEN_KEY);
  }

  deleteToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  getClaims() {
    return JSON.parse(window.atob(this.getToken()!.split('.')[1]))
  }
}
