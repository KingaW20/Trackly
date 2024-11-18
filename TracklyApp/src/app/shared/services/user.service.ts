import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseURL: string = environment.apiBaseUrl

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserProfile() {
    return this.http.get(this.baseURL + '/userprofile')
  }
}